import React from 'react';
import { GoogleMap, MarkerClusterer, useJsApiLoader, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import Position from '../Positions';
import Lat from './Lat6';
import logo from './../logo.png';


const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 22.5726,
  lng: 88.3639
};

async function getData(){
  const response1 = await axios.get('https://dcb-node-back.herokuapp.com/colleges/districts');
  return response1.data;
}
async function getStatus(){
  const response2 = await axios.get('https://dcb-node-back.herokuapp.com/colleges/statuses');
  return response2.data;
}
async function getBlock(){
  const response = await axios.get('https://dcb-node-back.herokuapp.com/colleges/blocks');
  return response.data;
}
function distance(latitude1, longitude1, latitude2, longitude2) {
  var p = 0.017453292519943295;    //This is  Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((latitude2 - latitude1) * p)/2 + 
          c(latitude1 * p) * c(latitude2 * p) * 
          (1 - c((longitude2 - longitude1) * p))/2;
  var R = 6371; //  Earth distance in km so it will return the distance in km
  var dist = 2 * R * Math.asin(Math.sqrt(a)); 
  return dist;
}

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAiOEixVl4_Xip7RnI-ZmDLT3cXgv3xoYA"
  })
  const [st_list, setST] = React.useState([]);
  const [status, setStatus] = React.useState([]);
  const [bl_list, setBlist] = React.useState([]);
  const [map, setMap] = React.useState(null)
  const [name, setName] = React.useState("")
  const [selected, setSelected] = React.useState(null)
  const [state, setState] = React.useState("")
  const [type, setType] = React.useState("")
  const [block, setBlock] = React.useState("")
  const [data, setData] = React.useState(false)
  const [arr, setarr] = React.useState([])
  const [inst, setInst] = React.useState("")
  const handleState = async (e)=>{
    setState(e.target.value);
    console.log(e.target.value);
    const res = await axios.get(`https://dcb-node-back.herokuapp.com/colleges/${e.target.value}`);
    const block_lists = []
    const list = []
    if (type=== "" && block === ""){
      res.data.map(async (i)=>{
        const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
        list.push(dict);
        if(!block_lists.includes(i.block)){
          block_lists.push(i.block);
        }
      })
      setarr(list);
      setBlist(block_lists);
    }
    else if (type !== "" && block === ""){
      res.data.map(async (i)=>{
        if (i.status === type) {
          const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
          list.push(dict);
          if(!block_lists.includes(i.block)){
            block_lists.push(i.block);
          }
        }
      })
      setarr(list);
      setBlist(block_lists);
    }
    else if (type === "" && block !== ""){
      res.data.map(async (i)=>{
        if (i.block === block) {
          const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
          list.push(dict);
          if(!block_lists.includes(i.block)){
            block_lists.push(i.block);
          }
        }
      })
      setarr(list);
      setBlist(block_lists);
    }
    else {
      res.data.map(async (i)=>{
        if(i.block === block && i.status === type){
          const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
          list.push(dict);
          if(!block_lists.includes(i.block)){
            block_lists.push(i.block);
          }
        }
      })
      setarr(list);
      setBlist(block_lists);
    }
  }
  const handleType = async (e)=>{
    setType(e.target.value);
    const res = await axios.get(`https://dcb-node-back.herokuapp.com/colleges/status/${e.target.value}`);
    const list = []
    if (state === "" && block === ""){
      res.data.map(async (i)=>{
        const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
        list.push(dict);
      })
      setarr(list);
    }
    else if (state === "" && block !== ""){
      res.data.map(async (i)=>{
        if (i.block === block) {
          const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
          list.push(dict);
        }
      })
      setarr(list);
    }
    else if (state !== "" && block === ""){
      res.data.map(async (i)=>{
        if(i.district === state){
          const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
          list.push(dict);
        }
      })
      setarr(list);
    }
    else {
      res.data.map(async (i)=>{
        if (i.district === state && i.block == block){
          const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
          list.push(dict);
        }
      })
      setarr(list);
    }
  }
  const handleBlock = async (e)=>{
    setBlock(e.target.value);
    const res = await axios.get(`https://dcb-node-back.herokuapp.com/colleges/block/${e.target.value}`);
    const list = []
    if (state === "" && type === ""){
      res.data.map(async (i)=>{
        const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
        list.push(dict);
      })
      setarr(list);
    }
    else if (state !== "" && type === ""){
      res.data.map(async (i)=>{
        if(i.district === state){
          const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
          list.push(dict);
        }
      })
      setarr(list);
    }
    else if (type !== "" && state === "") {
      res.data.map(async (i)=>{
        if (i.status === type){
          const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
          list.push(dict);
        }
      })
      setarr(list);
    }
    else {
      res.data.map(async (i)=>{
        if (i.district === state && i.status == type){
          const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
          list.push(dict);
        }
      })
      setarr(list);
    }
  }
  const searchfilter = async(lat, lng) => {
    console.log(lat, lng);
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=AIzaSyAiOEixVl4_Xip7RnI-ZmDLT3cXgv3xoYA`);
    setarr([]);
    // console.log(response.data.results[0].address_components);
    const stateName = response.data.results[0].address_components[2].long_name;
    const res = await axios.get(`https://dcb-node-back.herokuapp.com/colleges/${stateName.toUpperCase()}`);
    // console.log(res.data)
    setState(stateName.toUpperCase());
    const list = [];
    const block_lists = [];
    res.data.map(async (i)=>{
      const dict = {lat: i.lat, lng: i.lng, time: new Date(), name: i.institute, courses: "CS, IT, ETCE"}
      list.push(dict);
      if(!block_lists.includes(i.block)){
        if(i.block !== null){
          block_lists.push(i.block);
        }
      }
    })
    setarr(list);
    setBlist(block_lists);
    setState(stateName.toUpperCase());
    setBlock("");
    setType("");
  }
  const markers = []
  const mapref = React.useRef();
  const defLoad = async ()=>{
    const resp = await axios.get('https://dcb-node-back.herokuapp.com/colleges');
    // const payload = {

    // }
    // const resp2 = await axios.post('https://app.cpcbccr.com/caaqms/caaqms_landing_map_all');
    // console.log(resp2.data);
    const list = []
    resp.data.map(async (i)=>{
      const dict = {
        lat: i.lat,
        lng: i.lng,
        name: i.institute, courses: "CS, IT, ETCE",
      }
      list.push(dict);
    })
    setarr(list);
    const temp3 = await getBlock();
    setBlist(temp3);
  }
  const onLoad = React.useCallback(async function callback(map) {
    mapref.current = map;
    const temp = await getData();
    setST(temp);
    const temp2 = await getStatus();
    setStatus(temp2);
    // const response = await axios.get('https://eodb.indiagis.org/eodb/gmap/fetch.distcoord?code=');
    const response = Lat;
    var x =0;
    while(x<97474) {
      const state_data = []
      for(let i=x+1;i<response.length;i++){
        var result = 0;
        if(i!== 0){
          result = (distance(response[i-1][4], response[i-1][3], response[i][4], response[i][3]));
        }
        if (result >= 5){
          x = i;
          break;
        }
        // console.log(result);
        const dict = {
          lat: parseFloat(response[i][4]), lng: parseFloat(response[i][3])
        }
        state_data.push(dict);
      }
      var location = new google.maps.Polyline({
        path: state_data,
        strokeColor: 'red',
      })
      // console.log(response.data);
      if (data === false) {
        location.setMap(map);
      }
    }
    defLoad();
  }, [arr])
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const getplace = async (lat, lng) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=AIzaSyAiOEixVl4_Xip7RnI-ZmDLT3cXgv3xoYA`)
    setName(response.data.results[0].formatted_address);
  }
  const handleData = (e)=>{
    setData(e.target.checked);
  }
  const handleLoad = ()=>{
    defLoad();
    setState("");
    setBlock("");
    setType("");
  }
  const handleMarker = (arr)=>{
    const obj = []
    for(let i=0; i<arr.length; i++){ 
      obj.push(<Marker key={i} position={{lat: arr[i].lat, lng: arr[i].lng}} icon={{ url: logo, scaledSize: new google.maps.Size(50,50), origin: new google.maps.Point(0, 0), anchor:new google.maps.Point(25, 25)}} onClick={()=>{setSelected(arr[i]);getplace(arr[i].lat, arr[i].lng); setInst(arr[i].name);}} />)
    }
    return obj;
  }
  return isLoaded ? (
      <div>
        <div className="Box">
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={handleData} name={data}/>
          <label className="form-check-label" for="flexSwitchCheckDefault">{data ? "Remove All" : "Show All Institutions"}</label>
        </div>
        <button className="btn btn-primary w-100" onClick={handleLoad}>Get All Data</button>
        <div className="input-group my-2">
          <select className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon" value={state} onChange={handleState}>
            <option defaultValue="">Choose The District</option>
            {st_list.map((i, index)=>{
              return (
                <option key={index} value={i}>{i}</option>
              )
            })}
          </select>
        </div>
        <div className="input-group my-3">
          <select className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon" value={block} onChange={handleBlock}>
            <option defaultValue="123">Choose The Block</option>
            {bl_list.map((i, index) =>{
              return (
                <option value={i} key={index}>{i}</option>
              )
            })}
          </select>
        </div>
        <div className="input-group my-3">
          <select className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon" value={type} onChange={handleType}>
            <option defaultValue="">Choose The Institution type</option>
            {status.map((i, index) =>{
              return (
                <option value={i} key={index}>{i}</option>
              )
            })}
          </select>
        </div>
        {arr.length !== 40 && data && <ul style={{listStyleType: "lower-roman"}}>
          {arr.map((i, index) =>{
            return (
              <details key={index}>
                <summary>{i.name.slice(0,1) + i.name.slice(1,24).toLowerCase()}.....</summary>
                <p>Courses Given: {i.courses}</p>
              </details>
            )
          })}
        </ul>}
        </div>
        <h1>ITI & Polytechnic🏣</h1>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={(e)=>{
            // setMarker((current)=>[
            //     ...current,
            //     {
            //         lat: e.latLng.lat(),
            //         lng: e.latLng.lng(),
            //         time: new Date(),
            //     },
            // ]);
            searchfilter(e.latLng.lat(), e.latLng.lng());
        }}

      >
        {/* {data && arr.map((marker, index)=> (
            <Marker key={index} position={{lat: marker.lat, lng: marker.lng}} icon={{ url: "src/logo.png", scaledSize: new window.google.maps.Size(50, 50), origin: new google.maps.Point(0, 0), anchor:new google.maps.Point(25, 25)}} onClick={()=>{setSelected(marker);getplace(marker.lat, marker.lng); setInst(marker.name);}} />
        )) } */}
        {data && handleMarker(arr)}
        {selected ? (<InfoWindow position={{lat: selected.lat, lng: selected.lng}} onCloseClick={()=>{setSelected(null); setName("");}}>
        <div className="card" style={{width: "18rem"}}>
          {/* <img src="/src/logo.png" className="card-img-top" alt="..." height="40px" widht="40px"/> */}
          <div className="card-body">
            <h6 className="card-title">{inst}</h6>
            <p className="card-text">{name}</p>
          </div>
        </div>
          </InfoWindow>) : null}
        <></>
      </GoogleMap></div>
  ) : <></>
}

export default React.memo(Map)