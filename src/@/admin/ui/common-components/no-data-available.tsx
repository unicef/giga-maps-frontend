function NoDataAvailable({ columns }: { columns: number }) {
  const elementsArray = Array.from({ length: columns }, (_, index) => index);
  return (<tr>
    {elementsArray.map((item) => {
      if (Math.ceil(elementsArray.length / 2) === item) {
        return (<td key={item} style={{ background: "#fff", border: "none", minWidth: "11rem" }}>no data available</td>)
      }
      else {
        return (<td style={{ background: "#fff", border: "none" }} key={item}></td>)
      }
    })}
  </tr>
  )
}

export default NoDataAvailable