import { connect } from "react-redux";
import Count from "../Components/Count";
import { increment, decrement } from "../Redux/action";
const mapStateToProps = (state) => ({ count: state })
const mapDispatchToProps = (dispatch) => {
    return {
        increment: (number) => dispatch(increment(number)),
        decrement: (number) => dispatch(decrement(number)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Count)