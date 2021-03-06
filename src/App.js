import React, { Component, Fragment } from 'react';
import './App.css';

class App extends Component {
    static testFlip(options, numPancakes) {
        return (options.reduce((optionCollector, option) => {
            const optionChanges = App.getChanges(option);
            for (let i = 1; i < (numPancakes + 1); i++) {
                const newOption = App.flip(option, i);
                const newChanges = App.getChanges(newOption);
                if (newChanges === 0 || newChanges < optionChanges) {
                    optionCollector.push(newOption);
                }
            }
            return optionCollector;
        }, []));
    }

    static flip(stack, flipNum) {
        const flipped = stack.slice(0, flipNum);
        return flipped.reverse().map(pancake => !pancake).concat(stack.slice(flipNum));
    }

    static isAllHappy(stack) {
        return !stack.includes(false);
    }

    constructor(props) {
        super(props);

        this.state = {
            input: `10
+-+++
-----
+++++
++++-
--+--
++-++
-+-+-
+-+-+
---+-
-+-+-+--+-+--`,
            output: '',
        };

        this.convertInput = this.convertInput.bind(this);
        this.onType = this.onType.bind(this);
    }

    componentDidMount() {
        this.convertInput();
    }

    onType(input) {
        this.setState({ input });
    }

    static getChanges(stack) {
        const size = stack.length;
        let changes = 0;
        let lastTime = stack[0];
        for (let i = 0; i < size; i++) {
            const pancake = stack[i];
            if (lastTime !== pancake) {
                lastTime = pancake;
                changes++;
            }
        }
        return changes;
    }

    static getCount(stack) {
        let count = App.getChanges(stack);
        if ((!stack[0] && count % 2 === 0) || (stack[0] && count % 2 === 1)) {
            count++;
        }
        return count;
    }

    static getCountSlow(stack) {
        const numPancakes = stack.length;
        let foundAllHappys = false;
        let count = 0;
        if (App.isAllHappy(stack)) {
            return count;
        }
        let options = [stack];
        while (!foundAllHappys && count < numPancakes + 1) {
            count++;
            options = App.testFlip(options, numPancakes);
            // eslint-disable-next-line
            options.map((option) => {
                if (App.isAllHappy(option)) {
                    foundAllHappys = true;
                }
                return option;
            });
            if (foundAllHappys) {
                return count;
            }
        }
        return count;
    }

    convertInput() {
        const { input } = this.state;
        let inputArr = input.split(/\s+/g);
        const stackCount = parseInt(inputArr[0], 10);
        inputArr = inputArr.slice(1);
        if (inputArr.length !== stackCount) {
            this.setState({ output: 'wrong number of stacks' });
            return false;
        }
        inputArr = inputArr.map(stackStr => (stackStr.split('').map(character => character === '+')));
        const output = inputArr.reduce((outputCollector, val, index) => {
            outputCollector.push((
                <Fragment key={`fast-${index}`}>
                    Case #
                    {(parseInt(index, 10) + 1)}
                    :
                    {App.getCount(inputArr[index])}
                    <br />
                </Fragment>
            ));
            return outputCollector;
        }, []);
        this.setState({ output });
        return null;
    }

    render() {
        const { input, output } = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <h3>Pancake Party</h3>
                    <p>
                        <a href="https://github.com/katymdc/pancakes">Source Code</a>
                    </p>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <textarea onChange={(e) => { this.onType(e.target.value); }} value={input} />
                                <br />
                                <button type="button" onClick={this.convertInput}>Check</button>
                            </div>
                            <div className="col">
                                <p>{output}</p>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
