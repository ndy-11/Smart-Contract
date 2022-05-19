import React, { Component } from 'react'

export class Sell extends Component {
	render() {
		return (
			<div className="col-md-12">
				<div className="col-md-4">
					<h1>Sell Product</h1>
					<form 
						onSubmit={(event) => {
							event.preventDefault()
							const name = this.productName.value
							const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
							this.props.createProduct(name, price)
						}}>
						<div className="form-group mr-sm-2">
							<label htmlFor="productName">Product Name</label>
							<input
							id="productName"
							type="text"
							ref={(input) => { this.productName = input }}
							className="form-control"
							placeholder="iPhone 12 Pro"
							required />
						</div>
						<div className="form-group mr-sm-2">
							<label htmlFor="productPrice">Product Price</label>
							<input
							id="productPrice"
							type="text"
							ref={(input) => { this.productPrice = input }}
							className="form-control"
							placeholder="1.2"
							required />
						</div>
						<button type="submit" className="btn btn-info">Submit</button>
					</form>
				</div>
				<hr className="my-4"/>
				<h5>Your Products</h5>
				<table className="table table-bordered">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Name</th>
							<th scope="col">Price</th>
						</tr>
					</thead>
					<tbody>
						{this.props.products.filter(p => p.owner === this.props.account).length > 0
							? this.props.products
								.filter(p => p.owner === this.props.account)
								.map((product, key) => {
								return (
									<tr key={key}>
										<th scope="row">{key+1}</th>
										<td>{product.name}</td>
										<td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} ETH</td>
									</tr>
								)
								})
							: <tr><td colSpan="3" className="text-center">You not have any products yet.</td></tr>
						}
					</tbody>
				</table>
			</div>
		)
	}
}

export default Sell