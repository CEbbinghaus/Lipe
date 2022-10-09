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

/// <summary>
/// The Type that the token represents.
/// </summary>
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

/// <summary>
/// Generates a Token from the '{', ':' and '}' positions including modifier and everything else
/// </summary>
/// <param name="message">The message to generate the tokens for</param>
/// <param name="startIndex">start index of the substring</param>
/// <param name="endIndex">end index of the substring</param>
/// <param name="formatIndex">index of the format character</param>
/// <returns>new Token</returns>
function GenerateToken(message: string, startIndex: number, endIndex: number, formatIndex: number): Token
{
	let body: string = null;
	let format: string = null;
	let modifier = '\0';

	// Empty Brackets therefore empty token
	if(endIndex - startIndex == 1)
	{
		return EmptyToken;
	}

	// Need to account for the ending bracket. 
	const totalLength = (endIndex - startIndex) + 1;

	// Only if the format exists do we want to find it
	if(formatIndex != -1)
	{
		const formatLength = endIndex - formatIndex;
		// Shrink both sides by 1 to remove key tokens
		format = message.slice(formatIndex + 1, formatLength - 1);
		// Reduce length of the body to only the first half
		endIndex = formatIndex;
	}

	const length = endIndex - startIndex;
	// Shrink both sides by 1 to remove key tokens
	body = message.slice(startIndex + 1, length - 1);

	switch(body[0])
	{
		case '@':
			modifier = '@';
			break;
	}

	// If the modifier has been determined we need to shorted the substring
	if(modifier != '\0')
		body = body.slice(1);

	return {
		Type: TokenType.ReplaceToken,
		body: body,
		format: format,
		modifier: modifier
	};
}

/// <summary>
/// Converts the string into tokens for later use
/// </summary>
/// <param name="message">The string that is being converted into tokens</param>
/// <returns>The tokens that came from the message</returns>
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
					body: message.slice(stringBegin, length)
				});
			
			stringBegin = end + 1;
			tokens.push(GenerateToken(message, start, end, format));
		}

		++index;
	}

	if(stringBegin != message.length)
	{
		const length: number = message.length - stringBegin;

		tokens.push({
			Type: TokenType.StringToken,
			body: message.slice(stringBegin, length)
		});
	}

	return tokens;
}
/// <summary>
/// Generate the original text which generated a Token.
/// </summary>
/// <param name="token">Token to generate the text for</param>
/// <returns>String of the original text</returns>
function GenerateTokenText(token: Token): Nullable<string>
{
	if(token.Type == TokenType.StringToken)
		return token.body;

	let result: string = "{";

	if(token.modifier != '\0')
		result += token.modifier;

	result += token.body;

	if(token.format != null)
		result += ":" + token.format;

	return result + "}";
}
/// <summary>
/// Combines all tokens in order resolving each one to its proper value
/// </summary>
/// <param name="tokens">The tokens to Reassemble</param>
/// <param name="values">A string object dictionary of values to use for the interpolation</param>
/// <param name="options">Any options to use for the Formatter</param>
/// <returns>a String reassembled from the token Array</returns>
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
		let failedToFind: boolean = false;

		const body = token.body ?? "";

		if(body.indexOf(".") != -1)
		{
			// Possibly not the best/most efficient way to retrieve nested properties from anonymous objects. Will need to try
			const propArr = body.split(".");
			
			// eslint-disable-next-line @typescript-eslint/ban-types
			let value: unknown = values[propArr[0]];

			for(let i = 0; (value !== undefined && value !== null) && i < propArr.length; ++i)
			{
				value = value[propArr[i]];
			}

			if(value == undefined)
				failedToFind = true;

		}else{
			if(!(value = values[body]))
				failedToFind = true;
		}

		if(value == undefined)
		{
			if(failedToFind)
				formatted += options.RegenerateUnknownTokens ? GenerateTokenText(token) : "";
			else
				formatted += "Null";
			continue;
		}
		
		formatted += Stringify(token, value);
	}
	return formatted;
}

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
			result = value?.toString() ?? "Null";
			break;
		default:
			{
				// We have to take into account the format of the data
				if(token.format != null)
				{
					// TODO: Write some super complicated logic to handle the data formatting or use String.Format or something akin
				}

				// We want to list all elements in an array 
				if(Array.isArray(value) && value.length > 0)
				{
					const output = [];

					for(let i = 0; i < value.length; ++i)
					{

						output.push(Stringify(token, value[i]) ?? "Null");
					}

					return `[${output.join(", ")}]`;
				}

				result = value.toString() ?? "";
			}
			break;
	}
	return result;
}

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
