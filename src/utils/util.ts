
export function InternalSplat(format: string, values: Record<string, unknown>): string{
	let result = format;

	for(const key in values){
		result = result.replace(`{${key}}`, values[key] as string);
	}

	return result;
}
