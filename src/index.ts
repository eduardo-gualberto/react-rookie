import fs from 'fs'

type UseStateMatch = {
    sourceCodeFullLine: string
    stateName: string
    setStateName: string
}

const readExampleSourceCode = (withCycle: boolean, exampleNumber: number): string => {
    const folder = withCycle ? 'withCycles' : 'withoutCycles'
    try {
        const fileContentString = fs.readFileSync(`../examples/${folder}/example${exampleNumber}.txt`, { encoding: 'utf8' })
        return fileContentString
    } catch (error) {
        throw new Error(`Error reading source code example: no example${exampleNumber}.txt in folder ${folder}`);
    }
}

const identifyUseStates = (sourceCode: string): Array<UseStateMatch> => {
    const useStateRegex = /const\s*\[(\w+),\s*(\w+)\]\s*=\s*useState\(.*\);?/g
    let useStateMatches: Array<UseStateMatch> = []
    let m: RegExpExecArray | null = null 
    do {
        m = useStateRegex.exec(sourceCode);
        if (m) {
            const [sourceCodeFullLine, stateName, setStateName] = m
            useStateMatches.push({
                sourceCodeFullLine,
                stateName,
                setStateName
            })
        }
    } while (m);

    return useStateMatches
}

const sourceCode = readExampleSourceCode(true, 1)
const useStateMatches = identifyUseStates(sourceCode)

console.log(useStateMatches);
