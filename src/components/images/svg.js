import React from "react"

const SVG = ({
    path = '',
    alt = '',
    className = '',
    fill = null,
    height = null,
    width = null
}) => {
    return (
        <object 
            type="image/svg+xml" 
            data={path} 
            className={className} 
            style={{
                backgroundColor:fill,
                height:height,
                width:width
            }}>
            {alt}
        </object>
    )
}

export default SVG