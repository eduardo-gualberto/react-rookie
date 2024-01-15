import fs from 'fs'
import { identifyUseEffects, identifyUseStates, processEffectsIntoNodes } from './index'

export const readExampleSourceCode = (withCycle: boolean, exampleNumber: number): string => {
    const folder = withCycle ? 'withCycles' : 'withoutCycles'
    try {
        const fileContentString = fs.readFileSync(`examples/${folder}/example${exampleNumber}.txt`, { encoding: 'utf8' })
        return fileContentString
    } catch (error) {
        throw new Error(`Error reading source code example: no example${exampleNumber}.txt in folder ${folder}.\n Is it running in the prject's root?\n\n${error}`);
    }
}

export const examplesCodeBaseResources = (exampleNum: number) => ({
    withCycle: {
        sourceCode: readExampleSourceCode(true, exampleNum),
        states: identifyUseStates(readExampleSourceCode(true, exampleNum)),
        effects: identifyUseEffects(readExampleSourceCode(true, exampleNum)),
        nodes: processEffectsIntoNodes(identifyUseEffects(readExampleSourceCode(true, exampleNum)), identifyUseStates(readExampleSourceCode(true, exampleNum)))
    },
    withoutCycle: {
        sourceCode: readExampleSourceCode(false, exampleNum),
        states: identifyUseStates(readExampleSourceCode(false, exampleNum)),
        effects: identifyUseEffects(readExampleSourceCode(false, exampleNum)),
        nodes: processEffectsIntoNodes(identifyUseEffects(readExampleSourceCode(false, exampleNum)), identifyUseStates(readExampleSourceCode(false, exampleNum)))
    }
})