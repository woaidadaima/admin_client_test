import React, { Component } from 'react'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }
    state = {
        count: 0
    }

    increment = () => {
        this.setState(state => ({ count: state.count + this.myRef.current.value * 1 }))
    }
    decrement = () => {
        this.setState(state => ({ count: state.count - this.myRef.current.value * 1 }))
    }
    incrementIfOdd = () => {
        if (this.state.count % 2 === 1) {
            this.setState(state => ({ count: state.count + this.myRef.current.value * 1 }))
        }
    }
    incrementAsync = () => {
        setTimeout(() => {
            this.setState(state => ({ count: state.count + this.myRef.current.value * 1 }))
        }, 1000)
    }
    render() {
        const { count } = this.state
        return (
            <>
                <h1>click {count} time</h1>
                <select ref={this.myRef} style={{ marginRight: 10 }}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <button style={{ marginRight: 10 }} onClick={this.increment}>+</button>
                <button style={{ marginRight: 10 }} onClick={this.decrement}>-</button>
                <button style={{ marginRight: 10 }} onClick={this.incrementIfOdd}>increment if odd</button>
                <button style={{ marginRight: 10 }} onClick={this.incrementAsync}>increment async</button>
            </>
        )
    }
}
