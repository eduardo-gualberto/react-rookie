import fs from 'fs'

export const readExampleSourceCode = (withCycle: boolean, exampleNumber: number): string => {
    const folder = withCycle ? 'withCycles' : 'withoutCycles'
    try {
        const fileContentString = fs.readFileSync(`examples/${folder}/example${exampleNumber}.txt`, { encoding: 'utf8' })
        return fileContentString
    } catch (error) {
        throw new Error(`Error reading source code example: no example${exampleNumber}.txt in folder ${folder}.\n Is it running in the prject's root?\n\n${error}`);
    }
}