function Tile({playerTurn, className, value, onClick}) {
  let hoverClass = null;
  if (value === null && playerTurn !== null) {
    hoverClass = `${playerTurn.toLowerCase()}-hover`;
  }

  return (
      <div onClick={onClick} className={`tile ${className} ${hoverClass}`}>{value}</div>
  )
}

export default Tile;
