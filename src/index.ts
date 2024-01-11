import { readExampleSourceCode } from './helpers'

type UseStateToken = {
    sourceCodeFullLine: string
    stateName: string
    setStateName: string
}

type UseEffectTokens = {
    sourceCodeFullLine: string
    effectBody: string
    effectDeps: string
}

export const identifyUseStates = (sourceCode: string): Array<UseStateToken> => {
    const useStateRegex = /const\s*\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=\s*useState\(.*\);?/g
    let useStateTokens: Array<UseStateToken> = []
    let m: RegExpExecArray | null = null 
    do {
        m = useStateRegex.exec(sourceCode);
        if (m) {
            const [sourceCodeFullLine, stateName, setStateName] = m
            useStateTokens.push({
                sourceCodeFullLine,
                stateName,
                setStateName
            })
        }
    } while (m);
    return useStateTokens
}

export const identifyUseEffects = (sourceCode: string): Array<UseEffectTokens> => {
    const useEffectRegex = /useEffect\s*\(\s*\(\s*\)\s*=>\s*{\s*([^}]*)\s*}\s*\,\s*\[\s*([^\]]*)\s*\]\s*\)\s*;?/g
    let useEffectTokens: Array<UseEffectTokens> = []
    let m: RegExpExecArray | null = null 
    do {
        m = useEffectRegex.exec(sourceCode);
        if (m) {
            const [sourceCodeFullLine, effectBody, effectDeps] = m
            useEffectTokens.push({
                sourceCodeFullLine,
                effectBody,
                effectDeps
            })
        }
    } while (m);
    return useEffectTokens
}
