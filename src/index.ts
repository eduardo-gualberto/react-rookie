import { readExampleSourceCode } from './helpers'
import { nanoid } from 'nanoid'

const a = nanoid()

type UseStateToken = {
    sourceCodeFullLine: string
    stateName: string
    setStateName: string
}

type UseEffectToken = {
    sourceCodeFullLine: string
    effectBody: string
    effectDeps: string
}

type Node = UseEffectToken & {
    edges: Array<Node>
    inDegree: number
    id: string
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

export const identifyUseEffects = (sourceCode: string): Array<UseEffectToken> => {
    const useEffectRegex = /useEffect\s*\(\s*\(\s*\)\s*=>\s*{\s*([^}]*)\s*}\s*\,\s*\[\s*([^\]]*)\s*\]\s*\)\s*;?/g
    let useEffectToken: Array<UseEffectToken> = []
    let m: RegExpExecArray | null = null
    do {
        m = useEffectRegex.exec(sourceCode);
        if (m) {
            const [sourceCodeFullLine, effectBody, effectDeps] = m
            useEffectToken.push({
                sourceCodeFullLine,
                effectBody,
                effectDeps
            })
        }
    } while (m);
    return useEffectToken
}

type UseStateMappingToNodes = UseStateToken & {
    dependentNodes: Array<Node>
    dispatchNodes: Array<Node>
}

export const processEffectsIntoNodes = (effects: Array<UseEffectToken>, states: Array<UseStateToken>): Array<Node> => {

    const stateMappings: Array<UseStateMappingToNodes> = states.map(state => ({ ...state, dependentNodes: [], dispatchNodes: [] }))
    const nodes: Array<Node> = effects.map(effect => ({ ...effect, edges: [], inDegree: 0, id: nanoid() }))

    // if node dispatches any setState, put it in dispatchNodes of the state's mapping.
    // if node's dependency array contains the state being processed, put it in dependentNodes of the state's mapping.
    // for each node in nodes array
    mapNodesToStates(nodes, states, stateMappings)

    // for each dispatching node, put the state's mapping dependentNodes to its edges array, if it hasn't already
    // letting commented out 2 other ways of doing the same thing in case it breaks in future
    connectNodes(stateMappings)

    return nodes
}

const mapNodesToStates = (nodes: Array<Node>, states: Array<UseStateToken>, stateMappings: Array<UseStateMappingToNodes>): void => {
    nodes.forEach(node => {
        for (const state of states) {
            if (node.effectBody.match(state.setStateName)) {
                const mapping = stateMappings.find(sm => sm.setStateName === state.setStateName)
                mapping?.dispatchNodes.push(node)
            }
            if (node.effectDeps.match(state.stateName)) {
                const mapping = stateMappings.find(sm => sm.stateName === state.stateName)
                mapping?.dependentNodes.push(node)
            }
        }
    })
}

const connectNodes = (stateMappings: Array<UseStateMappingToNodes>) => {
    stateMappings.forEach(mapping => {
        // for (let node of mapping.dispatchNodes) {
        //     node.edges = node.edges.concat(mapping.dependentNodes)
        // }
        // for (let node of mapping.dispatchNodes) {
        //     node.edges = node.edges.concat(
        //         mapping.dependentNodes.filter(dn => !node.edges.map(e => e.effect.sourceCodeFullLine).includes(dn.effect.sourceCodeFullLine))
        //     )
        // }
        for (let node of mapping.dispatchNodes) {
            node.edges = node.edges.concat(mapping.dependentNodes)
            node.edges = [...new Set(node.edges)]   // this works because if there are dupes, they are references to the same object. This way the Array to Set conversion algorithm works properly
        }
    })
}

// Algorithm based on https://www.geeksforgeeks.org/detect-cycle-in-a-graph/
export const detectCycle = (nodes: Array<Node>): boolean => {
    const nodesNum = nodes.length
    const q: Array<Node> = []; // queue to store vertices with 0 in-degree
    let visited = 0; // count of visited vertices

    const algoNodes = nodes

    // calculate in-degree of each vertex
    for (const node of algoNodes)
        node.inDegree = algoNodes.filter(an => an.edges.some(e => e.id === node.id)).length

    // enqueue vertices with 0 in-degree
    for (const node of algoNodes)
        if (node.inDegree === 0)
            q.push(node)

    // BFS traversal
    while (q.length > 0) {
        const u = q.shift();
        visited++;

        if (u) {
            // reduce in-degree of adjacent vertices
            for (let v of u.edges) {
                const algoV = algoNodes.find(an => an.id === v.id)
                if (algoV) {
                    algoV.inDegree -= 1;
                    // if in-degree becomes 0, enqueue the vertex
                    if (algoV.inDegree === 0) {
                        q.push(algoV);
                    }
                }
            }
        }
    }

    return visited !== nodesNum; // if not all vertices are visited, there is a cycle
}

const sourceCode = readExampleSourceCode(true, 1)
const effects = identifyUseEffects(sourceCode)
const states = identifyUseStates(sourceCode)

const nodes = processEffectsIntoNodes(effects, states)

console.log('result: ', detectCycle(nodes));
