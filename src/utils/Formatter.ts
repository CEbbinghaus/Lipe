type Nullable<T> = T | null;

/**
 * Options to configure the Formatting Behavior
 * @interface FormatterOptions
 */
interface FormatterOptions
{
	RegenerateUnknownTokens: boolean;
}

const DefaultFormatterOptions: FormatterOptions = {
	RegenerateUnknownTokens: true
};

/**
 * The kind of token it represents. Replace tokens are surrounded by braces
 * whereas string tokens just represent a piece of text
 * @enum {number}
 */
enum TokenType
{
	ReplaceToken,
	StringToken
}

interface Token
{   

	Type: TokenType ;
	body?: string ;
	format?: string ;
	modifier?: string ;
}

const EmptyToken: Token = {
	Type: null,
	body: null,
	format: null,
	modifier: null
};

/**
 * Generates a Token from the '{', ':' and '}' positions including modifier and everything else
 * 
 * @param {string} message The message to generate the tokens for
 * @param {number} startIndex start index of the substring
 * @param {number} endIndex end index of the substring
 * @param {number} formatIndex index of the format character
 * @returns {Token} A new Token
 */
function GenerateToken(message: string, startIndex: number, endIndex: number, formatIndex: number): Token
{
	let body: string = null;
	let format: string = null;
	let modifier = null;

	// Empty Brackets therefore empty token
	if(endIndex - startIndex == 1)
	{
		return EmptyToken;
	}

	// Only if the format exists do we want to find it
	if(formatIndex != -1)
	{
		// Shrink both sides by 1 to remove key tokens
		format = message.slice(formatIndex + 1, endIndex);
		// Reduce length of the body to only the first half
		endIndex = formatIndex;
	}

	// Shrink both sides by 1 to remove key tokens
	body = message.slice(startIndex + 1, endIndex);

	switch(body[0])
	{
		case '@':
			modifier = '@';
			break;
		case '!':
			modifier = '!';
			break;
	}

	// If the modifier has been determined we need to shorted the substring
	if(modifier != null)
		body = body.slice(1);

	return {
		Type: TokenType.ReplaceToken,
		body: body,
		format: format,
		modifier: modifier
	};
}

/**
 * Converts the string into tokens for later use
 * 
 * @param {string} message he string that is being converted into tokens
 * @param {FormatterOptions} options 
 * @returns {Token[]} The tokens that form the message
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Tokenize(message: string, options: FormatterOptions): Token[]
{
	// All the Tokens we found in this file
	const tokens: Token[] = [];
	let index: number = 0;
	let stringBegin: number = 0;

	while(index < message.length)
	{
		// We found a Token. 
		if(message[index] == '{'  &&  message[index + 1] != '{')
		{
			// The Beginning of the string. Opening Bracket
			let start = index;
			// End of the string. Closing Bracket
			let end = -1;
			// Format Character of the string. Colon index
			let format = -1;

			// Search ahead until the end to construct the token (skip the open bracket)
			for (index++; index < message.length; index++)
			{
				let finished: boolean = false;

				// Reset start and format if another open bracket is encountered without encountering a closing bracket
				switch(message[index])
				{
					case '{':
						start = index;
						format = -1;
						break;
					case '}':
						end = index;
						finished = true;
						break;
					case ':':
						format = index;
						break;
				}

				if(finished)
					break;
			}

			// The end is the end of the string. Not including the closing bracket
			if(end == -1)
				break;

			const length: number = start - stringBegin;

			// skip empty string tokens
			if(length > 0)
				tokens.push({
					Type: TokenType.StringToken,
					body: message.slice(stringBegin, start)
				});
			
			stringBegin = end + 1;
			tokens.push(GenerateToken(message, start, end, format));
		}

		++index;
	}

	if(stringBegin != message.length)
	{
		tokens.push({
			Type: TokenType.StringToken,
			body: message.slice(stringBegin, message.length)
		});
	}

	return tokens;
}

/**
 * Generate the original text which generated a Token.
 * 
 * @param {Token} token Token to generate the text for
 * @returns {Nullable<string>} String of the original text
 */
function GenerateTokenText(token: Token): Nullable<string>
{
	if(token.Type == TokenType.StringToken)
		return token.body;
	
	let result: string = "{";
	
	if(token.modifier != null)
		result += token.modifier;
		
	result += token.body ?? "";

	if(token.format != null)
		result += ":" + token.format;

	return result + "}";
}

/**
 * Combines all tokens in order resolving each one to its proper value
 * 
 * @param {Token[]} tokens The tokens to Reassemble
 * @param {Record<string, unknown>} values A object to use for the interpolation
 * @param {FormatterOptions} options  Any options to use for the Formatter
 * @returns {string} A String reassembled from the token Array
 */
function ReassembleTokens(tokens: Token[], values: Record<string, unknown>, options: FormatterOptions): string {
	
	let formatted: string = "";

	for(const token of tokens)
	{
		if(token.Type == TokenType.StringToken){
			formatted += token.body;
			continue;
		}

		if(values == null)
		{
			if(options.RegenerateUnknownTokens)
				formatted += GenerateTokenText(token);
			continue;
		}

		let value: unknown = null;

		const body = token.body ?? "";

		// Possibly not the best/most efficient way to retrieve nested properties from anonymous objects. Will need to try
		const propArr = body.split(".");
		
		// eslint-disable-next-line @typescript-eslint/ban-types
		value = values[propArr[0]];

		for(let i = 1; (value !== undefined && value !== null) && i < propArr.length; ++i)
		{
			value = value[propArr[i]];
		}

		if(value == undefined)
		{
			formatted += options.RegenerateUnknownTokens ? GenerateTokenText(token) : "";
			continue;
		}
		
		formatted += Stringify(token, value);
	}
	return formatted;
}

/**
 * Stringifies a value according to the token it came from
 * 
 * @param {Token} token The token that evaluated to this value
 * @param {unknown} value The value evaluated out of the tokens context
 * @returns {Nullable<string>} A string representation of the value
 */
function Stringify(token: Token, value: unknown): Nullable<string> {
	if(typeof(value) == 'string')
		return value as string;

	let result: string = "";

	switch(token.modifier)
	{
		case '@':
			result = JSON.stringify(value);
			break;
		case '!':
			result = value?.toString() ?? "null";
			break;
		default:
			{
				// We have to take into account the format of the data
				// if(token.format != null)
				// {
				// TODO: Write some super complicated logic to handle the data formatting or use String.Format or something akin
				// }

				// We want to list all elements in an array 
				if(Array.isArray(value))
				{
					const output = [];

					for(let i = 0; i < value.length; ++i)
					{
						output.push(Stringify(token, value[i]) ?? "null");
					}

					return `[${output.join(", ")}]`;
				}

				result = value?.toString() ?? "null";
			}
			break;
	}
	return result;
}

/**
 * Formats a string replacing all braced tokens with corresponding values out of the object
 * 
 * @export
 * @param {string} message The message that contains the format and any other text
 * @param {Record<string, unknown>} values A object containing all values that should be interpolated
 * @param {FormatterOptions} [options] Any options for the formatter on how it should function
 * @returns {string} The formatted string with all tokens replaced with values
 */
export function Format(message: string, values: Record<string, unknown>, options?: FormatterOptions): string
{
	// Exit early if there is nothing to format
	if(!message)
		return message ?? "";

	if(options == null)
		options = DefaultFormatterOptions;

	const tokens = Tokenize(message, options);

	return ReassembleTokens(tokens, values, options);
}
