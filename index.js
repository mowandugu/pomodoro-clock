//componets:

const Header = () => {
    return( 
      <h1 id="heading" style={{fontSize: '47px'}}>
          ~ POMODORO CLOCK ~ 
      </h1>
    );
  }
  
  const SetTimer = ({ type, title, value, handleSetTimers }) => {
    return (
      <div className='SetTimers' style={{fontSize: 17}}>
        <div id={`${type}-label`}>{title}</div>
        <div className='SetTimer-Buttons'>
          <button id={`${type}-decrement`} onClick={() => handleSetTimers(false, `${type}Default`)} style={{fontSize: 17}}>
            -
          </button>
          <div id={`${type}-length`}>{value}</div>
          <button id={`${type}-increment`} onClick={() => handleSetTimers(true, `${type}Default`)} style={{fontSize: 17}}>
            + 
          </button>
        </div>
      </div>
    );
  }
  
  const DisplayTimer = ({ modeType, time }) => {
    return(
      <div className='Timer'>
        <h1 id='timer-label'>{modeType === 'session' ? 'Session' : 'Break'}</h1>
        <h1 id='time-left'>{time}</h1>
      </div>
    ); 
  } 
  
  const Controls = ({ active, handleReset, handlePlayPause }) => {
    return (
      <div className='Controls'>
        <button id='start_stop' onClick={handlePlayPause} style={{fontSize: 17}}>
          start/stop
        </button>
        <button id='reset' onClick={handleReset} style={{fontSize: 17}}>
        re-start
        </button>
    </div>
    );
  }
  
  const Footer = () => {
      return( 
          <footer> 
              <p>&#9400; 2021 Mark Wandugu&#8194; &bull; &#8194;<a href="https://mowandugu.github.io/" target="_blank" rel="noreferrer">Portfolio</a></p>
          </footer>
      );
  }
  
  //App-------------
  
  class PomodoroClock_app extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        breakDefault: 5,
        sessionDefault: 25,
        timerMode: 'session',
        time: 1500,
        active: false,
        touched: false
      }
      
      this.handleSetTimers = this.handleSetTimers.bind(this);
      this.handleResetButton = this.handleResetButton.bind(this);
      this.handlePlayPauseButton = this.handlePlayPauseButton.bind(this);
    }
  
  
    componentDidUpdate(prevProps, prevState) {
      if (prevState.time === 0 && prevState.timerMode === 'session') {
        this.setState({ time: this.state.breakDefault * 60, timerMode: 'break' })
        this.audio.play()
      }
      if (prevState.time === 0 && prevState.timerMode === 'break') {
        this.setState({ time: this.state.sessionDefault * 60, timerMode: 'session' })
        this.audio.play()
      }
    }
    
    handleSetTimers = (increment, type) => {
      if (increment && this.state[type] === 60) return   
      if (!increment && this.state[type] === 1) return
      let newValue = this.state[type] + (increment ? 1 : -1);
      if (type === "sessionDefault") {
        this.setState({
          sessionDefault: newValue,
          time: newValue * 60
        })
      } else {
        this.setState({
          breakDefault: newValue
        })
      }
    }
  
    setSecondsToMs = (seconds) => {
      let min = Math.floor(seconds / 60);
      let sec = seconds - (min * 60);
  
      if (min < 10) {min = "0"+min;}
      if (sec < 10) {sec = "0"+sec;}
  
      return min+":"+sec;
    }
  
    handleResetButton = () => {
      this.setState({ 
        breakDefault: 5, 
        sessionDefault: 25, 
        time: 1500,
        timerMode: 'session',
        touched: false,
        active: false
      })
      this.audio.pause()
      this.audio.currentTime = 0
      clearInterval(this.pomodoro) 
    }
  
  
    handlePlayPauseButton = () => {
      if (this.state.active) {
        clearInterval(this.pomodoro)
        this.setState({ active: false })
      } else {
        if (this.state.touched) {
          this.pomodoro = setInterval(() => this.setState({ time: this.state.time - 1 }), 1000)
          this.setState({ active: true })
        } else {
          this.setState({ 
            time: this.state.sessionDefault * 60, 
            touched: true, 
            active: true }, () => this.pomodoro = setInterval(() => this.setState({ time: this.state.time - 1 }), 1000))
        } 
      }
    }
    
  
    render() {
      return (
        <div>
          <Header />
          <div className="app-wrapper">
            <div className='timers-wrapper'>
              <SetTimer 
                type='break' 
                title='Break Length' 
                value={this.state.breakDefault} 
                handleSetTimers={this.handleSetTimers} />
              <SetTimer 
                type='session' 
                title='Session Length' 
                value={this.state.sessionDefault} 
                handleSetTimers={this.handleSetTimers} />
            </div>
            <DisplayTimer 
              modeType={this.state.timerMode} 
              time={this.setSecondsToMs(this.state.time)} />
            <Controls 
              active={this.state.active} 
              handlePlayPause={this.handlePlayPauseButton} 
              handleReset={this.handleResetButton} />
            <audio id='beep' 
              src='https://res.cloudinary.com/drpcjt13x/video/upload/v1599590677/Proyectos/Pomodoro%20Clock/bells003_ne9dwp.wav'
              ref={el => this.audio = el}></audio>
          </div>
          <Footer />
        </div>  
      );
    }
  }
  
  
  ReactDOM.render(<PomodoroClock_app />, document.getElementById('root'));