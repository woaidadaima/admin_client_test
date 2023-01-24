import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class Count extends Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }

    static propTypes = {
        increment: PropTypes.func.isRequired,
        count: PropTypes.number.isRequired,
        decrement: PropTypes.func.isRequired,
        incrementAsync: PropTypes.func.isRequired
    }
    increment = () => {
        const number = this.myRef.current.value * 1
        this.props.increment(number)
    }
    decrement = () => {
        const number = this.myRef.current.value * 1
        this.props.decrement(number)
    }
    incrementIfOdd = () => {
        const number = this.myRef.current.value * 1
        if (this.props.count % 2 === 1) {
            this.props.increment(number)
        }
    }
    incrementAsync = () => {
        const number = this.myRef.current.value * 1
        this.props.incrementAsync(number)
    }
    render() {
        const { count } = this.props
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
