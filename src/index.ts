import fs from 'fs'

type UseStateMatch = {
    sourceCodeFullLine: string
    stateName: string
    setStateName: string
}

export const identifyUseStates = (sourceCode: string): Array<UseStateMatch> => {
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