import React from "react";
import {useEffect, useState} from "react";

/*
BUGS:
    Money count doesn't display value correctly on load, however it is saved in localstorage properly
    FIXED: issue was with the variable name; it was jus set to "money" however we store it as "moneyCount" LOL
    
FEATURES TO ADD:
    Button to add a swearjar with name, money per swear, and optional timewindow vars
    Jar visuals, like coins falling in a jar and a "fluid" sim

*/

class Jar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            swearCount: parseInt(localStorage.getItem(props.name + " swearCount")) || 0,
            swearLog: JSON.parse(localStorage.getItem(props.name+" swearLog")) || [],
            moneyCount: parseFloat(localStorage.getItem(props.name+" moneyCount")) || 0,
            timeWindow: 20, // in minutes, set the time window for swears to count
            moneyPerSwear: 0.25 // $0.25 per swear
        };
    }
    
    // on swear, increment swearCount and add time to swearLog
    handleSwear() {
        console.log(this.state.name, "swore!!", Date.now());
        const newSwearCount = this.state.swearCount + 1;
        this.setState(prevState => ({
            swearCount: newSwearCount,
            swearLog: [Date.now(), ...prevState.swearLog]
        }));
        this.updateStorage("swearCount", newSwearCount);
        this.updateMoney();
    }

    // update money count based on swearCount and swearLog
    updateMoney() {
        // iterate over the most recent swears and increase exponentially over the last x minutes of swears
        const recentSwears = this.state.swearLog.filter(swearTime => {
            return Date.now() - swearTime < this.state.timeWindow * 60 * 1000; //filters within the time window!
        });
        
        const newMoney = this.state.moneyCount + (recentSwears.length+1) * this.state.moneyPerSwear;
        if(newMoney < this.state.moneyCount) {
            this.updateStorage("swearLog", JSON.stringify(this.state.swearLog));
            return;
        }
        this.setState(prevState => ({moneyCount: newMoney}));

        this.updateStorage("moneyCount", JSON.stringify(newMoney));
        this.updateStorage("swearLog", JSON.stringify(this.state.swearLog));
    }
    
    updateStorage(key, value) {
        key = " " + key;
        localStorage.setItem(this.state.name+key, value)
    }

    render() {
        return (
            <div>
                <h1>{this.state.name}'s Swear Jar</h1>
                <button onClick={() => this.handleSwear()}>
                    {this.state.name} Swear
                </button>
                <p>Swear Count: {this.state.swearCount}</p>
                <p>Money Count: ${this.state.moneyCount}</p>
            </div>
        );
    }
}

export default Jar;