import { connect } from "react-redux";
import Count from "../Components/Count";
import { increment, decrement, incrementAsync } from "../Redux/action";
// const mapStateToProps = (state) => ({ count: state })
// const mapDispatchToProps = (dispatch) => {
//     return {
//         increment: (number) => dispatch(increment(number)),
//         decrement: (number) => dispatch(decrement(number)),
//     }
// }
// 简写形式
// const mapStateToProps = (state) => ({ count: state })
// const mapDispatchToProps = {
//     increment,
//     decrement
// }

export default connect(
    state => ({ count: state.count }),
    {
        increment,
        decrement,
        incrementAsync
    }
)(Count)