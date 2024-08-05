# CurryOn
CurryOn enhances your functional codebase by allowing you to map the input and output of curried functions. It provides a clean and efficient way to transform functions and their results.

## Installation
Install via npm:

```.bash
npm install curry-on
```

## Usage
### Basic Usage
To use CurryOn, import it and pass your base function to it. You can then use mapInput and mapOutput to transform the function's input and output.

```.ts
import { CurryOn } from 'curry-on'

// Define a curried function
const curryAdd = (a: number) => (b: number) => a + b

// load curried function
const add4 = curryAdd(4)

// Enhance the function with CurryOn
const add6 = CurryOn(add4).mapOutput(result => result + 2)

// Usage
const result = add6(2) // Output: 8
```

### Mutating Return Type
You can use mapOutput to change the return type of your function. Here's an example where the output is transformed to a string:

```.ts
import { CurryOn } from 'curry-on'

// Define a curried function
const curryAdd = (a: number) => (b: number) => a + b

// load curried function
const add4 = curryAdd(4)

// Enhance the function with CurryOn and mutate the return type
const addAndFormat = CurryOn(add4).mapOutput(result => `The result is: ${result}`)

// Usage
const result = addAndFormat(2) // Output: "The result is: 6"
```

## API
all methods returns an instance of `CurryOn` invokable as `rootFunction`

### CurryOn(rootFunc)
Enhances the given function with mapOutput and mapInput methods.

Parameters:
- rootFunc: The function to be enhanced.

### instance.mapOutput(processOutputCb)
Maps the output of the enhanced function to a new result type using the provided callback.

Parameters:
- processOutputCb: A function that processes the result of the enhanced function.

Returns:
- A new CurryOn instance with the output mapping applied.

### instance.mapInput(processInputCb)
Maps the input parameters of the enhanced function using the provided callback.

Parameters:
- processInputCb: A function that processes the input parameters of the enhanced function.

Returns:
- A new CurryOn instance with the input mapping applied.