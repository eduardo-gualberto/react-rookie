import { identifyUseStates } from '@/index'
import fs from 'fs'

const readExampleSourceCode = (withCycle: boolean, exampleNumber: number): string => {
    const folder = withCycle ? 'withCycles' : 'withoutCycles'
    try {
        const fileContentString = fs.readFileSync(`examples/${folder}/example${exampleNumber}.txt`, { encoding: 'utf8' })
        return fileContentString
    } catch (error) {
        throw new Error(`Error reading source code example: no example${exampleNumber}.txt in folder ${folder}.\n Is it running in the prject's root?`);
    }
}

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