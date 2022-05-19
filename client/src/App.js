import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Web3 from 'web3'
import './App.css';
import Marketplace from './contracts/Marketplace.json'
import Navbar from './components/Navbar'
import Main from './components/Main'
import Buy from './components/Buy'
import Sell from './components/Sell'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			account: '',
			productCount: 0,
			products: [],
			loading: true
		}

		this.createProduct = this.createProduct.bind(this)
		this.purchaseProduct = this.purchaseProduct.bind(this)
	}

	async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3
		// Load account
		const accounts = await web3.eth.getAccounts()
		this.setState({ account: accounts[0] })
		let balance = await web3.eth.getBalance(accounts[0]);
		await this.setState({balance: web3.utils.fromWei(balance, 'Ether')})
		const networkId = await web3.eth.net.getId()
		const networkData = Marketplace.networks[networkId]
		if(networkData) {
			const marketplace = new web3.eth.Contract(Marketplace.abi, networkData.address)
			this.setState({ marketplace })
			const productCount = await marketplace.methods.productCount().call()
			this.setState({ productCount })
			// Load products
			for (var i = 1; i <= productCount; i++) {
				const product = await marketplace.methods.products(i).call()
				this.setState({
				products: [...this.state.products, product]
				})
			}
			this.setState({ loading: false})
		} else {
			window.alert('Marketplace contract not deployed to detected network.')
		}
	}

	createProduct(name, price) {
		this.setState({ loading: true })
		this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
		.once('receipt', async (receipt) => {
			this.setState({
				products: [...this.state.products, receipt.events.ProductCreated.returnValues]
			})
			window.location.reload()
		})
	}

	purchaseProduct(id, price) {
		this.setState({ loading: true })
		this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
		.once('receipt', async (receipt) => {
			console.log(receipt)
			window.location.reload()
		})
		.catch((e) => {
            // Transaction rejected or failed
            console.log(e);
        });
	}

	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route 
						exact
						path="/"
						render={props => {
							return (
								<div>
									<Navbar account={this.state.account} balance={this.state.balance} active="home" />
									<div className="container" style={{marginTop: '50px'}}>
										<div className="row">
											<main role="main" className="col-lg-12 d-flex">
											{ this.state.loading
												? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
												: <Main />
											}
											</main>
										</div>
									</div>
								</div>
							)
						}}
					/>
					<Route 
						exact
						path="/buy"
						render={(props) => {
							return (
								<div>
									<Navbar account={this.state.account} balance={this.state.balance} active="buy"/>
									<div className="container" style={{marginTop: '50px'}}>
										<div className="row">
											{ this.state.loading
												? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
												: <Buy
													account={this.state.account}
													products={this.state.products}
													purchaseProduct={this.purchaseProduct} 
													/>
											}
										</div>
									</div>
								</div>
							)
						}}
					/>

					<Route 
						exact
						path="/sell"
						render={(props) => {
							return (
								<div>
									<Navbar account={this.state.account} balance={this.state.balance} active="sell"/>
									<div className="container" style={{marginTop: '50px'}}>
										<div className="row">
											<main role="main" className="col-lg-12 d-flex">
											{ this.state.loading
												? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
												: <Sell 
													products={this.state.products}
													account={this.state.account}
													createProduct={this.createProduct} 
													/>
											}
											</main>
										</div>
									</div>
								</div>
							)
						}}
					/>
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;