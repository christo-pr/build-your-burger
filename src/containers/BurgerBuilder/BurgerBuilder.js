import React, { Component } from 'react';
import axios from '../../axios-orders';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import Controls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import Ordersummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHanlder';
import * as burgerActions from '../../store/actions';

class BurgerBuilder extends Component {
  state = {
    purchasable: false,
    goCheckout: false,
    loading: false
  }

  componentDidMount = () => {
    axios.get('https://build-your-burger-3bcff.firebaseio.com/ingredients.json')
      .then( res => {
        this.setState({ ingredients: res.data})
      })
      .catch( err => {})
  }
  

  updatePurchasable() {
    return Object.values(this.props.ings).some( value => value)
  }

  purchaseHandler = () => {
    this.setState({ goCheckout: true });
  }
  
  purchaseCancelHandler = () => {
    this.setState({ goCheckout: false });
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  }

  render () {
    const disabledInfo = { ...this.props.ings }
    for (const key in disabledInfo) {
      disabledInfo[key] = !disabledInfo[key];
    }
    let modalContent = null;
    
    let content = <Spinner />

    if (this.props.ings) {
      content = (
        <Aux>
          <Burger ingredients={this.props.ings}/>
          <Controls add={this.props.onIngredientAdded}
                    remove={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    currentPrice={this.props.totalPrice}
                    purchasable={this.updatePurchasable()}
                    checkout={this.purchaseHandler}/>
        </Aux>
      )

      modalContent = <Ordersummary ingredients={this.props.ings}
      cancel={this.purchaseCancelHandler}
      continue={this.purchaseContinueHandler}
      price={this.props.totalPrice}/>
    }
    if (this.state.loading) {
      modalContent = <Spinner />
    }

    return (
      <Aux>
        <Modal show={this.state.goCheckout} closeModal={this.purchaseCancelHandler}>
          {modalContent}
        </Modal>
        {content}
      </Aux>
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    totalPrice: state.totalPrice
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(burgerActions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(burgerActions.removeIngredient(ingName))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));