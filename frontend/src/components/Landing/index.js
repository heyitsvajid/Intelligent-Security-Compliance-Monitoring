import React from 'react';
import '../../assets/css/custom.css'

class Landing extends React.Component{

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "monthly"
    };
    }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render(){
    return(
      <div>  </div>
    )
  }
}

export default Landing;
