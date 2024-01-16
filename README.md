# react-rookie: a static code analysis tool
```react-rookie``` is a tool designed for React beginners struggling the comprehend and implement correct hooks usage. 

It makes sure you are not:
* creating ``useEffect`` infinite loops
* using ``useState`` redundantly (upcoming)

## important info
``react-rookie`` is a working, but still in development tool and so some use cases may not be covered by design, such as:
* Not all hooks can be analysed. Currently only ```useState``` and ```useEffect``` are supported
* ``useEffect`` should always use [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) in order for it to be analysed
* ``useState`` should always be declared using [destructuring syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

## installation

The project was created using ``node 20.11.0`` and ``yarn 1.22.21``, make sure to have those installed first. 

Get all dependencies with:
``npm install`` or ``yarn install``

## usage

To start the bundler you should run ``yarn bundle`` to execute the custom script that invokes webpack with watch mode on.

Then, you can ``yarn go`` to execute anything contained in ``src/index.ts`` file or even ``yarn test`` and ``yarn coverage`` to run Jest unit tests and its coverage functionality
