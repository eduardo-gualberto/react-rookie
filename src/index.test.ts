import { identifyUseEffects, identifyUseStates } from '@/index'
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
        '    }, [])\r\n' +
        '\r\n' +
        '    ',
      effectBody: "setFirstName(fullName.split(' ')[0])\r\n" +
        "        console.log('test log')\r\n" +
        '    ',
      effectDeps: ''
    }
  ])
})