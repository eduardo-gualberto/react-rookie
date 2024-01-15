import { identifyUseEffects, identifyUseStates, processEffectsIntoNodes, detectCycle } from '@/index'
import { readExampleSourceCode } from './helpers'

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

const example1States = [
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
]
const example1Effects = [
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
]
const example1Nodes = processEffectsIntoNodes(example1Effects, example1States)

test('processEffectsIntoNodes: check if it returned the right amount of nodes', () => {
  expect(example1Nodes.length).toBe(2)
})

test('processEffectsIntoNodes: check if the returned nodes are correctly extracted (effectDeps)', () => {
  expect(example1Nodes[0].effectDeps).toBe("firstName, lastName")
  expect(example1Nodes[1].effectDeps).toBe("fullName")
})

test('processEffectsIntoNodes: check if the nodes have the correct amount of edges', () => {
  expect(example1Nodes[0].edges.length).toBe(1)
  expect(example1Nodes[1].edges.length).toBe(1)
})

test('processEffectsIntoNodes: check if the nodes edges are correctly connected', () => {
  expect(example1Nodes[0].edges[0].effectDeps).toBe('fullName')
  expect(example1Nodes[1].edges[0].effectDeps).toBe('firstName, lastName')
})

test('detectCycle: example1 test if it returns true', () => {
  expect(detectCycle(example1Nodes)).toBe(true)
})

const example2SourceCode = readExampleSourceCode(true, 2)
const example2States = identifyUseStates(example2SourceCode)
const example2Effects = identifyUseEffects(example2SourceCode)

const example2Nodes = processEffectsIntoNodes(example2Effects, example2States)

test('detectCycle: example2 test if it returns true', () => {
  expect(detectCycle(example2Nodes)).toBe(true)
})

const example3SourceCode = readExampleSourceCode(true, 3)
const example3States = identifyUseStates(example3SourceCode)
const example3Effects = identifyUseEffects(example3SourceCode)

const example3Nodes = processEffectsIntoNodes(example3Effects, example3States)

test('detectCycle: example3 test if it returns true', () => {
  expect(detectCycle(example3Nodes)).toBe(true)
})

const example4SourceCode = readExampleSourceCode(true, 4)
const example4States = identifyUseStates(example4SourceCode)
const example4Effects = identifyUseEffects(example4SourceCode)

const example4Nodes = processEffectsIntoNodes(example4Effects, example4States)

test('detectCycle: example4 test if it returns true', () => {
  expect(detectCycle(example4Nodes)).toBe(true)
})

const example1FSourceCode = readExampleSourceCode(false, 1)
const example1FStates = identifyUseStates(example1FSourceCode)
const example1FEffects = identifyUseEffects(example1FSourceCode)

const example1FNodes = processEffectsIntoNodes(example1FEffects, example1FStates)

test('detectCycle: example1 test if it returns false', () => {
  expect(detectCycle(example1FNodes)).toBe(false)
})

const example2FSourceCode = readExampleSourceCode(false, 2)
const example2FStates = identifyUseStates(example2FSourceCode)
const example2FEffects = identifyUseEffects(example2FSourceCode)

const example2FNodes = processEffectsIntoNodes(example2FEffects, example2FStates)

test('detectCycle: example2 test if it returns false', () => {
  expect(detectCycle(example2FNodes)).toBe(false)
})