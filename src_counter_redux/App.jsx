import React, { Component } from 'react'
import { increment, decrement } from './Redux/action'
export default class App extends Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }
    increment = () => {
        this.props.store.dispatch(increment(this.myRef.current.value * 1))
    }
    decrement = () => {
        this.props.store.dispatch(decrement(this.myRef.current.value * 1))
    }
    incrementIfOdd = () => {
        if (this.props.store.getState() % 2 === 1) {
            this.props.store.dispatch(increment(this.myRef.current.value * 1))
        }
    }
    incrementAsync = () => {
        setTimeout(() => {
            this.props.store.dispatch(increment(this.myRef.current.value * 1))
        }, 1000)

    }
    render() {
        return (
            <>
                <h1>click {this.props.store.getState()} time</h1>
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
