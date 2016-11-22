import React from 'react';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';
import { Logout, Login, Signup} from './auth';
import { onAuthStateChanged } from './api'
import Main from './main';
import NotesList from './notes-list';
import SyncFirebase from './sync-firebase';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedOn: false };
  }

  componentDidMount() {
    onAuthStateChanged(user =>
      this.setState({ loggedOn: !!user })
    );
  }

  // FIXME: having Miss outside of SyncFirebase is necessary...
  //  but ruins the pattern, should be made into an HOC around Main/NotesList
  render() {
    const {loggedOn} = this.state;

    return (
      <BrowserRouter>
        <div>
          {loggedOn ? (
            <div>
              <Logout />
              <SyncFirebase>
                <Match exactly pattern='/' component={Main} />
                <Match pattern='/notes' component={NotesList} />
              </SyncFirebase>
              <Miss render={() => <Redirect to='/' />} />
            </div>
          ) : (
            <div>
              <Match pattern='/login' component={Login} />
              <Match pattern='/signup' component={Signup} />
              <Miss render={() => <Redirect to='/login' />} />
            </div>
          )}
        </div>
      </BrowserRouter>
    );
  }
}
