import React, { useState, useEffect } from 'react';
import { Card, Form,CardFooter, CardTitle,CardHeader,CardBody,Dropdown, DropdownToggle, DropdownMenu, DropdownItem,DropdownContext , Input, Button, Table } from 'reactstrap';
import localforage from 'localforage';
import Select from 'react-select';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';


function QTOForm() {
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [elevations, setElevations] = useState([]);
    const [sections, setSections] = useState([]);
    const [places, setPlaces] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedElevation, setSelectedElevation] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

    // Additional fields for QuantityTakeOff
    const [poseCode, setPoseCode] = useState('');
    const [manufacturingCode, setManufacturingCode] = useState('');
    const [material, setMaterial] = useState('');
    const [description, setDescription] = useState('');
    const [width, setWidth] = useState('');
    const [depth, setDepth] = useState('');
    const [height, setHeight] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [multiplier, setMultiplier] = useState('');
    const [multiplier2, setMultiplier2] = useState('');
    const [takeOut, setTakeOut] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [rows, setRows] = useState([]);

    const [editingRowId, setEditingRowId] = useState(null); // A new state

    const [editingRowData, setEditingRowData] = useState({
        selectedEditBuilding: null,
        editPoseCode: '',
        editManufacturingCode: '',
        editMaterial: '',
        editDescription: '',
        editWidth: '',
        editDepth: '',
        editHeight: '',
        editQuantity: '',
        editUnit: '',
        editMultiplier: '',
        editMultiplier2: '',
        editTakeOut: '',
     
        
        //... other fields ...
    });
    
    
    useEffect(() => {
        fetchBuildings();
    }, []);

    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const fetchBuildings = async () => {
        try {
            const access_token = await localforage.getItem('access_token'); 
      
            const response = await fetch('http://127.0.0.1:8000/api/buildings_for_project/',{
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(access_token)
              }});

                          const data = await response.json();
                          console.log(data)
            setBuildings(data);
        } catch (error) {
            console.error("Error fetching buildings:", error);
        }
    };

    const handleBuildingChange = async (buildingId) => {
        setSelectedBuilding(buildingId);
        console.log(buildingId);
        const access_token = await localforage.getItem('access_token'); 
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/floors_for_building/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                },
                body: JSON.stringify({
                    building_id: buildingId
                })
            });
            
            const data = await response.json();
            console.log(data);
            setElevations(data);
        } catch (error) {
            console.error("Error fetching elevations:", error);
        }
    };
    

    const handleElevationChange = async (elevationId) => {
        setSelectedElevation(elevationId);
        const access_token = await localforage.getItem('access_token'); 
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/sections_for_floor/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                },
                body: JSON.stringify({
                    elevation_id: elevationId
                })
            });
            const data = await response.json();
            setSections(data);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };

    const handleSectionChange = async (sectionId) => {
        setSelectedSection(sectionId);
        const access_token = await localforage.getItem('access_token'); 

        try {
            const response = await fetch('http://127.0.0.1:8000/api/places_for_section/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                },
                body: JSON.stringify({
                    section_id: sectionId
                })
            });
            const data = await response.json();
            setPlaces(data);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    const handleSubmit = async () => {
        const access_token = await localforage.getItem('access_token'); 
        console.log(selectedSection)
        try {
            const response = await fetch('http://127.0.0.1:8000/api/add_qto/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                },
                body: JSON.stringify({
                    building_id: selectedBuilding,
                    elevation_or_floor_id: selectedElevation,
                    section_id: selectedSection,
                    place_id: selectedPlace,
                    pose_code: poseCode,
                    manufacturing_code: manufacturingCode,
                    material: material,
                    description: description,
                    width: width,
                    depth: depth,
                    height: height,
                    quantity: quantity,
                    unit: unit,
                    multiplier: multiplier,
                    multiplier2: multiplier2,
                    take_out: takeOut
                })
            });
            const data = await response.json();
            if (response.status === 201) {
                console.log(data.message);
                setIsAdding(false); 
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    const buildingOptions = buildings.map(b => ({ value: b.id, label: b.name }));
    const elevationOptions = elevations.map(e => ({ value: e.id, label: e.name }));
    const sectionOptions = sections.map(s => ({ value: s.id, label: s.name }));
    const placeOptions = places.map(p => ({ value: p.id, label: p.name }));

    useEffect(() => {
        fetchBuildings();
        fetchRows();
    }, []);

    const handleCancel = () => {
        setShowPopup(false);
     
      };
  
    
    const fetchRows = async () => {
        const access_token = await localforage.getItem('access_token'); 
        try {
            const response = await fetch('http://127.0.0.1:8000/api/qto/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(access_token)
                }
            });
            const data = await response.json();
            setDataTable(data);
            console.log(data)
        } catch (error) {
            console.error("Error fetching rows:", error);
        }
    };
    
    const customStyles = {
        menu: (provided, state) => ({
          ...provided,
          maxHeight: '150px',
          overflowY: 'auto'
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
      };


      const [columnFilters, setColumnFilters] = useState({
        filter_building: '',
        filter_elevation: '',
        filter_section: '',
        filter_place: '',
        filter_poseCode: '',
        filter_manufacturingCode: '',
        filter_material: '',
        filter_description: '',
        filter_width: '',
        filter_depth: '',
        filter_height: '',
        filter_quantity: '',
        filter_unit: '',
        filter_multiplier: '',
        filter_multiplier2: '',
        filter_takeOut: ''
    });
    
    const filteredRows = rows.filter(row => 
        (!columnFilters.filter_building || row[0].toString().toLowerCase().includes(columnFilters.filter_building.toLowerCase())) &&
        (!columnFilters.filter_elevation || row[1].toString().toLowerCase().includes(columnFilters.filter_elevation.toLowerCase())) &&
        (!columnFilters.filter_section || row[2].toString().toLowerCase().includes(columnFilters.filter_section.toLowerCase())) &&
        (!columnFilters.filter_place || row[3].toString().toLowerCase().includes(columnFilters.filter_place.toLowerCase())) &&
        (!columnFilters.filter_poseCode || row[4].toString().toLowerCase().includes(columnFilters.filter_poseCode.toLowerCase())) &&
        (!columnFilters.filter_manufacturingCode || row[5].toString().toLowerCase().includes(columnFilters.filter_manufacturingCode.toLowerCase())) &&
        (!columnFilters.filter_material || row[6].toString().toLowerCase().includes(columnFilters.filter_material.toLowerCase())) &&
        (!columnFilters.filter_description || row[7].toString().toLowerCase().includes(columnFilters.filter_description.toLowerCase())) &&
        (!columnFilters.filter_width || row[8].toString().toLowerCase().includes(columnFilters.filter_width.toLowerCase())) &&
        (!columnFilters.filter_depth || row[9].toString().toLowerCase().includes(columnFilters.filter_depth.toLowerCase())) &&
        (!columnFilters.filter_height || row[10].toString().toLowerCase().includes(columnFilters.filter_height.toLowerCase())) &&
        (!columnFilters.filter_quantity || row[11].toString().toLowerCase().includes(columnFilters.filter_quantity.toLowerCase())) &&
        (!columnFilters.filter_unit || row[12].toString().toLowerCase().includes(columnFilters.filter_unit.toLowerCase())) &&
        (!columnFilters.filter_multiplier || row[13].toString().toLowerCase().includes(columnFilters.filter_multiplier.toLowerCase())) &&
        (!columnFilters.filter_multiplier2 || row[14].toString().toLowerCase().includes(columnFilters.filter_multiplier2.toLowerCase())) &&
        (!columnFilters.filter_takeOut || row[15].toString().toLowerCase().includes(columnFilters.filter_takeOut.toLowerCase()))
    );
    
    return (
        <div style={{marginTop:"100px"}}> 
            
            <div style={{ overflowX: 'auto', maxWidth: '100%', height:"500px"}}>

            <Table>
                <thead>
                    <tr>
                    <th>
                        <input
                            value={columnFilters.filter_building}
                            onChange={(e) => setColumnFilters(prev => ({ ...prev, filter_building: e.target.value }))}
                            placeholder="Filter by building..."
                        />
                    </th>
                    <th>
                        <input
                            value={columnFilters.filter_elevation}
                            onChange={(e) => setColumnFilters(prev => ({ ...prev, filter_elevation: e.target.value }))}
                            placeholder="Filter by elevation..."
                        />
                    </th>
                        <th>Building</th>
                        <th>Elevation</th>
                        <th>Section</th>
                        <th>Place</th>
                        <th>Pose Code</th>
                        <th>Manufacturing Code</th>
                        <th>Material</th>
                        <th>Description</th>
                        <th>Width</th>
                        <th>Depth</th>
                        <th>Height</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Multiplier</th>
                        <th>Multiplier2</th>
                        <th>Take Out</th>
                        {/* ... other headers */}
                    </tr>
                </thead>
                <tbody>
                    {isAdding && (
                        
                        <tr>
                             <td>
                                    <Select
                                        value={buildingOptions.find(option => option.value === selectedBuilding)}
                                        onChange={(option) => handleBuildingChange(option.value)}
                                        options={buildingOptions}
                                        placeholder="Select Building"
                                        styles={customStyles}

                                    />
                                </td>
                                <td>
                                    <Select
                                        value={elevationOptions.find(option => option.value === selectedElevation)}
                                        onChange={(option) => handleElevationChange(option.value)}
                                        options={elevationOptions}
                                        placeholder="Select Elevation"
                                        isDisabled={!selectedBuilding}
                                        styles={customStyles}

                                    />
                                </td>
                                <td>
                                    <Select
                                        value={sectionOptions.find(option => option.value === selectedSection)}
                                        onChange={(option) => handleSectionChange(option.value)}
                                        options={sectionOptions}
                                        placeholder="Select Section"
                                        isDisabled={!selectedElevation}
                                        styles={customStyles}

                                    />
                                </td>
                                <td>
                                    <Select
                                        value={placeOptions.find(option => option.value === selectedPlace)}
                                        onChange={(option) => setSelectedPlace(option.value)}
                                        options={placeOptions}
                                        placeholder="Select Place"
                                        isDisabled={!selectedSection}
                                        styles={customStyles}

                                    />
                                </td>
                            <td>
                                <Input type="text" placeholder="Pose Code" value={poseCode} onChange={(e) => setPoseCode(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Manufacturing Code" value={manufacturingCode} onChange={(e) => setManufacturingCode(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Material" value={material} onChange={(e) => setMaterial(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Width" value={width} onChange={(e) => setWidth(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Depth" value={depth} onChange={(e) => setDepth(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Multiplier" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Multiplier2" value={multiplier2} onChange={(e) => setMultiplier2(e.target.value)} />
                            </td>
                            <td>
                                <Input type="text" placeholder="Take Out" value={takeOut} onChange={(e) => setTakeOut(e.target.value)} />
                            </td>
                            <td>
                                <Button onClick={handleSubmit}>Submit</Button>
                            </td>
                        </tr>
                    )}
                     
        
                     {rows.map(row => (
                <tr key={row[0]}>
                    {editingRowId === row[0] ? (
                        
                        <>
                        <td>
                            
                    
                        <Select
   value={buildingOptions.find(option => option.value === editingRowData.selectedEditBuilding)}
   onChange={(option) => handleBuildingChange(option.value)}
   options={buildingOptions}
   placeholder="Select Building"
   styles={customStyles}
/>
                           </td>
                           <td>
                           <Select
   value={elevationOptions.find(option => option.value === editingRowData.selectedEditElevation)}
   onChange={(option) => handleElevationChange(option.value)}
   options={elevationOptions}
   placeholder="Select Elevation"
   isDisabled={!editingRowData.selectedEditBuilding}
   styles={customStyles}
/>
                           </td>
                           <td>
                           <Select
   value={sectionOptions.find(option => option.value === editingRowData.selectedEditSection)}
   onChange={(option) => handleSectionChange(option.value)}
   options={sectionOptions}
   placeholder="Select Section"
   isDisabled={!editingRowData.selectedEditElevation}
   styles={customStyles}
/>
                           </td>
                           <td>
                           <Select
   value={placeOptions.find(option => option.value === editingRowData.selectedEditPlace)}
   onChange={(option) => handlePlaceChange(option.value)}
   options={placeOptions}
   placeholder="Select Place"
   isDisabled={!editingRowData.selectedEditSection}
   styles={customStyles}
/>
                           </td>
                           <td>
    <Input 
        type="text" 
        placeholder="Manufacturing Code" 
        value={editingRowData.editManufacturingCode} 
        onChange={(e) => setEditingRowData({...editingRowData, editManufacturingCode: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Material" 
        value={editingRowData.editMaterial} 
        onChange={(e) => setEditingRowData({...editingRowData, editMaterial: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Description" 
        value={editingRowData.editDescription} 
        onChange={(e) => setEditingRowData({...editingRowData, editDescription: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Width" 
        value={editingRowData.editWidth} 
        onChange={(e) => setEditingRowData({...editingRowData, editWidth: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Depth" 
        value={editingRowData.editDepth} 
        onChange={(e) => setEditingRowData({...editingRowData, editDepth: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Height" 
        value={editingRowData.editHeight} 
        onChange={(e) => setEditingRowData({...editingRowData, editHeight: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Quantity" 
        value={editingRowData.editQuantity} 
        onChange={(e) => setEditingRowData({...editingRowData, editQuantity: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Unit" 
        value={editingRowData.editUnit} 
        onChange={(e) => setEditingRowData({...editingRowData, editUnit: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Multiplier" 
        value={editingRowData.editMultiplier} 
        onChange={(e) => setEditingRowData({...editingRowData, editMultiplier: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Multiplier2" 
        value={editingRowData.editMultiplier2} 
        onChange={(e) => setEditingRowData({...editingRowData, editMultiplier2: e.target.value})} 
    />
</td>
<td>
    <Input 
        type="text" 
        placeholder="Take Out" 
        value={editingRowData.editTakeOut} 
        onChange={(e) => setEditingRowData({...editingRowData, editTakeOut: e.target.value})} 
    />
</td>

                       <td>
                           <Button onClick={handleSubmit}>Submit</Button>
                       </td>
                   
                       
                        <>
                            {/* ... Edit view with inputs ... */}
                            <td>
                                <button onClick={() => {
                                    // Save logic here...
                                    setEditingRowId(null); // Exit edit mode for this row after saving
                                }}>Save</button>
                            </td>
                            
                        </>
                        </>
                    ) : (
                        <>
                              {filteredRows.map(row => (
                    <tr key={row[0]}>
                        {row.map((entry, entryIndex) => (
                            <td key={entryIndex}>{entry}</td>
                        ))}
                    </tr>
                ))}
                            <td>
                            <button onClick={() => {
    setEditingRowId(row[0]);
    setEditingRowData({
        selectedEditBuilding: row[1],
        selectedEditElevation: row[2],
        selectedEditSection: row[3],
        selectedEditPlace: row[4],
        editPoseCode: row[5],
        editManufacturingCode: row[6],
        editMaterial: row[7],
        editDescription: row[8],
        editWidth: row[9],
        editDepth: row[10],
        editHeight: row[11],
        editQuantity: row[12],
        editUnit: row[13],
        editMultiplier: row[14],
        editMultiplier2: row[15],
        editTakeOut: row[16],
        // ... adjust if needed based on your actual structure ...
    });
}}>Edit</button>


                            </td>
                        </>
                    )}
                </tr>
            ))}       
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="17">
                            {!isAdding && <Button color="primary" onClick={() => setShowPopup(true)}>+ Add</Button>}
                        </td>
                    </tr>
                </tfoot>
            </Table>

            {showPopup &&(
       <div className="popup">
              <Card style={{ maxWidth: '500px' }}>
          <CardHeader>
            <CardTitle tag="h4">Metraj ekle</CardTitle>
          </CardHeader>
          <CardBody style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
    <div className="form-item">
        <label>Bina Adı</label>
        <Select
            value={buildingOptions.find(option => option.value === selectedBuilding)}
            onChange={(option) => handleBuildingChange(option.value)}
            options={buildingOptions}
            placeholder="Select Building"
            styles={customStyles}
            menuPortalTarget={document.body}
        />
    </div>

    <div className="form-item">
        <label>Kat Adı</label>
        <Select
            value={elevationOptions.find(option => option.value === selectedElevation)}
            onChange={(option) => handleElevationChange(option.value)}
            options={elevationOptions}
            placeholder="Select Elevation"
            isDisabled={!selectedBuilding}
            styles={customStyles}
        />
    </div>

    <div className="form-item">
        <label>Bölüm Adı</label>
        <Select
            value={sectionOptions.find(option => option.value === selectedSection)}
            onChange={(option) => handleSectionChange(option.value)}
            options={sectionOptions}
            placeholder="Select Section"
            isDisabled={!selectedElevation}
            styles={customStyles}
        />
    </div>

    <div className="form-item">
        <label>Yer Adı</label>
        <Select
            value={placeOptions.find(option => option.value === selectedPlace)}
            onChange={(option) => setSelectedPlace(option.value)}
            options={placeOptions}
            placeholder="Select Place"
            isDisabled={!selectedSection}
            styles={customStyles}
        />
    </div>

    <div className="form-item">
        <label>Poz Kodu</label>
        <Input 
            type="text" 
            placeholder="Pose Code" 
            value={poseCode} 
            onChange={(e) => setPoseCode(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Üretim Kodu</label>
        <Input 
            type="text" 
            placeholder="Manufacturing Code" 
            value={manufacturingCode} 
            onChange={(e) => setManufacturingCode(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Malzeme</label>
        <Input 
            type="text" 
            placeholder="Material" 
            value={material} 
            onChange={(e) => setMaterial(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Açıklama</label>
        <Input 
            type="text" 
            placeholder="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Genişleme</label>
        <Input 
            type="text" 
            placeholder="Width" 
            value={width} 
            onChange={(e) => setWidth(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Derinlik</label>
        <Input 
            type="text" 
            placeholder="Depth" 
            value={depth} 
            onChange={(e) => setDepth(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Yükseklik</label>
        <Input 
            type="text" 
            placeholder="Height" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Miktar</label>
        <Input 
            type="text" 
            placeholder="Quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Birim</label>
        <Input 
            type="text" 
            placeholder="Unit" 
            value={unit} 
            onChange={(e) => setUnit(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Çarpan</label>
        <Input 
            type="text" 
            placeholder="Multiplier" 
            value={multiplier} 
            onChange={(e) => setMultiplier(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Çarpan2</label>
        <Input 
            type="text" 
            placeholder="Multiplier2" 
            value={multiplier2} 
            onChange={(e) => setMultiplier2(e.target.value)} 
        />
    </div>

    <div className="form-item">
        <label>Alma</label>
        <Input 
            type="text" 
            placeholder="Take Out" 
            value={takeOut} 
            onChange={(e) => setTakeOut(e.target.value)} 
        />
    </div>
</CardBody>

          <CardFooter>
          <Button onClick={handleSubmit}>Onayla</Button>
              
            
            <Button className="btn-round" color="danger" type="submit" onClick={handleCancel}>
              İptal Et
            </Button>
          </CardFooter>
        </Card>

            </div>
)}

             <Card >
              
              <CardBody >

            
                <ReactTable
                  data={dataTable.map((row,index) => ({
                    id: row[0],
building_name: row[1],
elevation_or_floor_name: row[2],
section_name: row[3],
place_name: row[4],
pose_code: row[5],
manufacturing_code: row[6],
material: row[7],
description: row[8],
width: row[9],
depth: row[10],
height: row[11],
quantity: row[12],
unit: row[13],
multiplier: row[14],
multiplier2: row[15],
take_out: row[16],
total: row[17],

                   
                    

                    actions: (
                      <div className='actions-left'>
                       
                         <Button
                          disabled={showEditPopup}
                          onClick={() => {
                            // Enable edit mode
                            
                           {handleClick(row)}
                           
                          
                          }}
                          
                          color='warning'
                          size='sm'
                          className='btn-icon btn-link edit'
                        >
                          <i className='fa fa-edit' />
                        </Button>{' '}
                        
                        <>
    
    
                          <Button
                            disabled={showEditPopup}
                            onClick={() => {
                              
                               warningWithConfirmAndCancelMessage() 
                               const rowToDelete = {...row};
                               const data = {
                               id: rowToDelete[0],

                              };
                              setDeleteData(data);
                              console.log(deleteConfirm)


                            }
                            }
                            color="danger"
                            size="sm"
                            className="btn-icon btn-link remove"
                          >
                            <i className="fa fa-times" />
                          </Button>
    
  </>


                      </div>
                    ),
                  }))}
                  columns={[
                    
                    {
                        Header: 'Bina Adı',
                        accessor: 'building_name',
                    },
                    {
                        Header: 'Kat Adı veya Kat Sayısı',
                        accessor: 'elevation_or_floor_name',
                    },
                    {
                        Header: 'Bölüm Adı',
                        accessor: 'section_name',
                    },
                    {
                        Header: 'Yer Adı',
                        accessor: 'place_name',
                    },
                    {
                        Header: 'Poz Kodu',
                        accessor: 'pose_code',
                    },
                    {
                        Header: 'Üretim Kodu',
                        accessor: 'manufacturing_code',
                    },
                    {
                        Header: 'Malzeme',
                        accessor: 'material',
                    },
                    {
                        Header: 'Açıklama',
                        accessor: 'description',
                    },
                    {
                        Header: 'Genişlik',
                        accessor: 'width',
                    },
                    {
                        Header: 'Derinlik',
                        accessor: 'depth',
                    },
                    {
                        Header: 'Yükseklik',
                        accessor: 'height',
                    },
                    {
                        Header: 'Miktar',
                        accessor: 'quantity',
                    },
                    {
                        Header: 'Birim',
                        accessor: 'unit',
                    },
                    {
                        Header: 'Çarpan',
                        accessor: 'multiplier',
                    },
                    {
                        Header: 'Çarpan2',
                        accessor: 'multiplier2',
                    },
                    {
                        Header: 'Alma',
                        accessor: 'take_out',
                    },
                    {
                        Header: 'Toplam',
                        accessor: 'total',
                    },
                    {
                        Header: 'İşlem',
                        accessor: 'actions',
                        sortable: false,
                        filterable: false,
                    },
                ]}
                
                  
                  defaultPageSize={10}
                  className='-striped -highlight'
                />
              </CardBody>
            </Card>
            </div>
        </div>
    );
}

export default QTOForm;