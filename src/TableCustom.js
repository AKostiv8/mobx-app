import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';
import FaTrash from 'react-icons/lib/fa/trash';
import FaEdit from 'react-icons/lib/fa/edit';
import './TableCustom.css';
import { observable, computed, configure, action, decorate, runInAction, values, autorun, reaction } from 'mobx';
import { observer } from 'mobx-react';
// configure({ enforceActions: true });



class TableStore {

  @observable data = [];
  @observable selected = [];


  constructor() {
         this.data = [];
         this.selected = [];
     }



  @action.bound load() {
   fetch('./MOCK_DATA.json')
   .then(response => response.json())
     .then(data => {
       runInAction(() => {
           this.data = data;
       });
     });
  }


  @computed get items() {
    return this.data;
  }

  @action deleteRowGl(index){
    var removeElin = this.selected.indexOf(index);
    // console.log(removeEl);
    console.log(this.data.splice(index, 1));
    this.data.splice(index, 1);
    this.selected.splice(removeElin, 1);
    // console.log(this.selected);
    return [this.data, this.selected]
  }

  @action deleteRowsMulti(){
    this.data = this.data.filter( ( el, index ) => !this.selected.includes( index ) );
    this.selected = [];
  }


}


const Appstore = new TableStore();


@observer class TableCustom extends Component{

  componentDidMount(){
    this.props.store.load();
  }


  constructor(props){
    super(props);
    this.state = {
      selected:[]
    }
  }


  handleDeleteRows = (index) => {
      this.props.store.deleteRowGl(index);
      var removeEl = this.state.selected.indexOf(index);
      this.state.selected.splice(removeEl, 1);
  }

  handleDeleteRowsMulti = () => {
    var newSelected = [...this.state.selected];
    const emptySelected = [];
    this.props.store.deleteRowsMulti();
    this.setState({
      selected: emptySelected
    });
  }




  toggleRow(id) {
    const newSelected = [...this.state.selected];
    var arrEl = newSelected.indexOf(id);

      if(arrEl == -1) {
        newSelected.push(id);

        //store
        this.props.store.selected.push(id)
        console.log(newSelected);
        console.log(this.props.store.selected);
      } else {
        newSelected.splice(arrEl, 1);

        // store
        this.props.store.selected.splice(arrEl, 1);
        console.log(newSelected);
        console.log(this.props.store.selected);
      }

    this.setState({
      selected: newSelected
    });

  }


  toggleSelectAll() {
    const newSelected = [...this.state.selected];
    const emptyArr = [];

    if(this.props.store.items.length == this.state.selected.length){
      this.setState({
        selected: emptyArr
      });

      this.props.store.selected = emptyArr;
      console.log(this.props.store.selected);

    } else {
      if((this.state.selected.length > 0) && (this.props.store.items.length !== this.state.selected.length)){
        newSelected.splice(0, this.state.selected.length);
        for (var i = 0; i < this.props.store.items.length; i++) {
          newSelected.push(i);

          this.props.store.selected.push(i);
        }

        console.log(this.props.store.selected);

        this.setState({
          selected: newSelected
        });
      } else {
        for (var i = 0; i < this.props.store.items.length; i++) {
          newSelected.push(i);

          this.props.store.selected.push(i)
        }

        console.log(this.props.store.selected);

        this.setState({
          selected: newSelected
        });
      }
    }
  }


  deleteRow(index) {

    var removeEl = this.state.selected.indexOf(index);
    // console.log(data.splice(index, 1));
    // data.splice(index, 1);
    this.state.selected.splice(removeEl, 1);
    // this.setState({data});
}



  render() {

    const store = this.props.store;
    // store.load();
    // console.log(store.data);
    // console.log(store.selected);

    let lastCell = 'last-cell-style';
    let iconStyles = 'menu';
    let iconTrash = 'iconTrash';



  return (
    <Table responsive striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>

          <label className="container-check">
          <input
                type="checkbox"
                className="checkbox"
                checked={(this.state.selected.length === store.items.length) && (this.state.selected != 0)}

                onChange={() => this.toggleSelectAll()}
              />
           <span className="checkmark"></span>
           </label>
           </th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>IP Address</th>
          <th>Country</th>
          <th>Last activity</th>
          <th>Frequency</th>
          <th className={(Object.keys(this.state.selected).length > 1 ? "deleteAllSelected" : "notAllSelected" )}>
            <a className={iconTrash} title="Delete all selected" onClick={() => this.handleDeleteRowsMulti()}>
              <FaTrash />
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        {store.items.map((x, i) => <tr key={i} className={[(this.state.selected.indexOf(i) !== -1 ? "tableSelected" : "" ), lastCell].join(' ')}>
            <td>
            <input
              type="checkbox"
              className="checkbox"
              checked={this.state.selected.indexOf(i) !== -1}
              onChange={(() => this.toggleRow(i))}
              // onClick={() => this.countSelection(i, x.id)}
            />
            </td>
            <td>{x.first_name}</td>
            <td>{x.last_name}</td>
            <td>{x.email}</td>
            <td>{x.gender}</td>
            <td>{x.ip_address}</td>
            <td>{x.country}</td>
            <td>{x.last_activity}</td>
            <td>{x.frequency}</td>
            <td>
              <a className={iconStyles} onClick ={index => this.handleDeleteRows(i)}><FaTrash /></a>
              <a className={iconStyles}><FaEdit /></a>
            </td>
          </tr>)}

      </tbody>

    </Table>
  );
}
}

export {TableCustom, Appstore}
