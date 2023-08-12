import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem,DropdownContext , Input, Button, Table } from 'reactstrap';
import localforage from 'localforage';

function QTOForm() {
    const [buildings, setBuildings] = useState([]);
    const [elevations, setElevations] = useState([]);
    const [sections, setSections] = useState([]);
    const [places, setPlaces] = useState([]);

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
        const access_token = await localforage.getItem('access_token'); 

        try {
            const response = await fetch('http://127.0.0.1:8000/api/floors_for_building/',{
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(access_token)
              }});
            const data = await response.json();
            console.log(data)
            setElevations(data);
        } catch (error) {
            console.error("Error fetching elevations:", error);
        }
    };

    const handleElevationChange = async (elevationId) => {
        setSelectedElevation(elevationId);
        try {
            const response = await fetch(`/api/sections-for-elevation?elevation_id=${elevationId}`);
            const data = await response.json();
            setSections(data);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };

    const handleSectionChange = async (sectionId) => {
        setSelectedSection(sectionId);
        try {
            const response = await fetch(`/api/places-for-section?section_id=${sectionId}`);
            const data = await response.json();
            setPlaces(data);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/add-qto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

    return (
        <div style={{marginTop:"100px"}}> 
            
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>

            <Table>
                <thead>
                    <tr>
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
                            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
                Select Building
            </DropdownToggle>
            <DropdownMenu>
                {buildings.map(building => (
                    <DropdownItem 
                        key={building.id} 
                        onClick={() => handleBuildingChange(building.id)}
                    >
                        {building.name}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>

                            </td>
                            <td>
                                <Dropdown onChange={(e) => handleElevationChange(e.target.value)}>
                                    <DropdownToggle caret>
                                        Select Elevation
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {elevations.map(elevation => (
                                            <DropdownItem key={elevation.id} value={elevation.id}>
                                                {elevation.name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </td>
                            <td>
                                <Dropdown onChange={(e) => handleSectionChange(e.target.value)}>
                                    <DropdownToggle caret>
                                        Select Section
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {sections.map(section => (
                                            <DropdownItem key={section.id} value={section.id}>
                                                {section.name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </td>
                            <td>
                                <Dropdown onChange={(e) => setSelectedPlace(e.target.value)}>
                                    <DropdownToggle caret>
                                        Select Place
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {places.map(place => (
                                            <DropdownItem key={place.id} value={place.id}>
                                                {place.name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
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
                    {/* Display existing rows of data below this */}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="17">
                            {!isAdding && <Button color="primary" onClick={() => setIsAdding(true)}>+ Add</Button>}
                        </td>
                    </tr>
                </tfoot>
            </Table>
            </div>
        </div>
    );
}

export default QTOForm;
