import React from "react";

export interface DropdownProps {
    onSelection : (event : any, value : any) => void
    value : any,
    values : any,
    valueDisplayProperty : string,
    maxHeight? : number
}

export class Dropdown extends React.Component<DropdownProps, any> {

    static defaultProps = {
        maxHeight : 300
    };
    
    render() {
        
        const {value, values, onSelection, maxHeight, valueDisplayProperty} = this.props;
        
        return <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button"
                    id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                {value}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                style={{"height": "auto", "maxHeight": `${maxHeight}px`, "overflowY": "scroll"}}>
                {values.map((v : any) => {
                    const display = v[valueDisplayProperty];
                    return <li key={display} onClick={(e) => onSelection(e, v)}
                               className="dropdown-item">{display}</li>
                })}
            </ul>
        </div>
    }
}