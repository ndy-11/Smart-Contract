import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {

	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-light shadow">
				<Link
					className="navbar-brand"
					to="/"
					rel="noopener noreferrer"
				>
					<img src="https://img.icons8.com/ios-filled/100/000000/ethereum.png" width="30" height="30" className="d-inline-block align-top" alt="logobrand" />
					ETH Marketplace
				</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav mr-auto">
						<li className={this.props.active === 'buy' ? 'nav-item active' : 'nav-item'}>
							<Link className="nav-link" to="/buy">Buy</Link>
						</li>
						<li className={this.props.active === 'sell' ? 'nav-item active' : 'nav-item'}>
							<Link className="nav-link" to="/sell">Sell</Link>
						</li>
					</ul>
					<div className="d-flex flex-column">
						<small className="nav-link text-dark p-0"><span id="account">Your account: <b>{this.props.account}</b></span></small>
						<small className="nav-link text-dark p-0"><span id="account">Balance: <b>{this.props.balance} ETH</b></span></small>
					</div>
				</div>
			</nav>
		);
	}
}

export default Navbar;
