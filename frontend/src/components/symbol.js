import React from 'react';

function Symbol(props) {
	const decodedSymbol = unescape(props.symbol);
	return <span>{decodedSymbol}</span>;
}

export default Symbol;
