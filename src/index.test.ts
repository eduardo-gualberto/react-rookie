import { identifyUseEffects, identifyUseStates, processEffectsIntoNodes, detectCycle } from '@/index'
import { examplesCodeBaseResources, readExampleSourceCode } from './helpers'

test('identifyUseStates: returns empty list when no useStates', () => {
    expect(identifyUseStates("")).toStrictEqual([])
})

test('identifyUseStates: return all three useStates from example1.txt', () => {
    const example1SourceCode = readExampleSourceCode(true, 1)
    expect(identifyUseStates(example1SourceCode)).toStrictEqual([
        {
          sourceCodeFullLine: "const [firstName, setFirstName] = useState('Taylor');",
          stateName: 'firstName',
          setStateName: 'setFirstName'
        },
        {
          sourceCodeFullLine: "const [lastName, setLastName] = useState('Swift');",
          stateName: 'lastName',
          setStateName: 'setLastName'
        },
        {
          sourceCodeFullLine: "const [fullName,setFullName] = useState('')",
          stateName: 'fullName',
          setStateName: 'setFullName'
        }
      ])
})

test('identifyUseStates: skip invalid syntax for useState in example2.txt', () => {
  const example2SourceCode = readExampleSourceCode(false, 2)
  expect(identifyUseStates(example2SourceCode)).toStrictEqual([
      {
        sourceCodeFullLine: "const [firstName, setFirstName] = useState('Taylor');",
        stateName: 'firstName',
        setStateName: 'setFirstName'
      },
      {
        sourceCodeFullLine: "const [fullName, setFullName] = useState('');",
        stateName: 'fullName',
        setStateName: 'setFullName'
      }
    ])
})


test('identifyUseStates: skip invalid syntax for useState in example3.txt', () => {
  const example3SourceCode = readExampleSourceCode(false, 3)
  expect(identifyUseStates(example3SourceCode)).toStrictEqual([
      {
        sourceCodeFullLine: "const [firstName, setFirstName] = useState('Taylor');",
        stateName: 'firstName',
        setStateName: 'setFirstName'
      }])
})

// TODO(eduardo): write tests for identifyUseEffects function
test('identifyUseEffects: returns empty list when theres no useEffect', () => {
  const example4SourceCode = readExampleSourceCode(false, 4)
  expect(identifyUseEffects(example4SourceCode)).toStrictEqual([])
})

test('identifyUseEffects: returns every useEffect in the source code', () => {
  const example1SourceCode = readExampleSourceCode(true, 1)
  expect(identifyUseEffects(example1SourceCode)).toStrictEqual([
    {
      sourceCodeFullLine: 'useEffect(() => {\r\n' +
        "        setFullName(firstName + ' ' + lastName);\r\n" +     
        '    }, [firstName, lastName]);',
      effectBody: "setFullName(firstName + ' ' + lastName);\r\n    ",
      effectDeps: 'firstName, lastName'
    },
    {
      sourceCodeFullLine: 'useEffect(() => {\r\n' +
        "        setFirstName(fullName.split(' ')[0])\r\n" +
        '    }, [fullName])\r\n',
      effectBody: "setFirstName(fullName.split(' ')[0])\r\n    ",    
      effectDeps: 'fullName'
    }
  ])
})

test('identifyUseEffects: returns every valid useEffect in the source code', () => {
  const example1SourceCode = readExampleSourceCode(true, 2)
  expect(identifyUseEffects(example1SourceCode)).toStrictEqual([
    {
      sourceCodeFullLine: 'useEffect(() => {\r\n' +
        "        setFullName(firstName + ' ' + lastName);\r\n" +
        '    }, [firstName, lastName]);',
      effectBody: "setFullName(firstName + ' ' + lastName);\r\n    ",
      effectDeps: 'firstName, lastName'
    },
    {
      sourceCodeFullLine: 'useEffect(() => {\r\n' +
        "        setFirstName(fullName.split(' ')[0])\r\n" +
        "        console.log('test log')\r\n" +
        '    }, [fullName])\r\n' +
        '\r\n' +
        '    ',
      effectBody: "setFirstName(fullName.split(' ')[0])\r\n" +
        "        console.log('test log')\r\n" +
        '    ',
      effectDeps: 'fullName'
    }
  ])
})

const { nodes: nodesExample1 } = examplesCodeBaseResources(1).withCycle

test('processEffectsIntoNodes: check if it returned the right amount of nodes', () => {
  expect(nodesExample1.length).toBe(2)
})

test('processEffectsIntoNodes: check if the returned nodes are correctly extracted (effectDeps)', () => {
  expect(nodesExample1[0].effectDeps).toBe("firstName, lastName")
  expect(nodesExample1[1].effectDeps).toBe("fullName")
})

test('processEffectsIntoNodes: check if the nodes have the correct amount of edges', () => {
  expect(nodesExample1[0].edges.length).toBe(1)
  expect(nodesExample1[1].edges.length).toBe(1)
})

test('processEffectsIntoNodes: check if the nodes edges are correctly connected', () => {
  expect(nodesExample1[0].edges[0].effectDeps).toBe('fullName')
  expect(nodesExample1[1].edges[0].effectDeps).toBe('firstName, lastName')
})

test('detectCycle: example1 test if it returns true', () => {
  const { nodes } = examplesCodeBaseResources(1).withCycle
  expect(detectCycle(nodes)).toBe(true)
})

test('detectCycle: example2 test if it returns true', () => {
  const { nodes } = examplesCodeBaseResources(2).withCycle
  expect(detectCycle(nodes)).toBe(true)
})

test('detectCycle: example3 test if it returns true', () => {
  const { nodes } = examplesCodeBaseResources(3).withCycle
  expect(detectCycle(nodes)).toBe(true)
})

test('detectCycle: example4 test if it returns true', () => {
  const { nodes } = examplesCodeBaseResources(4).withCycle
  expect(detectCycle(nodes)).toBe(true)
})

test('detectCycle: example1 test if it returns false', () => {
  const { nodes } = examplesCodeBaseResources(1).withoutCycle
  expect(detectCycle(nodes)).toBe(false)
})

test('detectCycle: example2 test if it returns false', () => {
  const { nodes } = examplesCodeBaseResources(2).withoutCycle
  expect(detectCycle(nodes)).toBe(false)
})