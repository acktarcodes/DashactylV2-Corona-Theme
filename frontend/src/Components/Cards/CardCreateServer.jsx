import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CreateServer from '../../Api/CreateServer';
import 'sweetalert2/dist/sweetalert2.min.css';

const MySwal = withReactContent(Swal);

import { toast } from 'react-toastify'



export default function CardCreateServer() {
	const [isLoading, setIsLoading] = React.useState(true);
	const [eggs, setEggs] = React.useState(String);
	const [locations, setLocations] = React.useState(String);

	const navigate = useNavigate();

	React.useEffect(() => {
		fetch('/api/admin/egg/get/all', {
			credentials: 'include'
		})
			.then(response => response.json())
			.then(json => {
				setEggs(json);
				fetch('/api/admin/location/get/all', {
					credentials: 'include'
				})
					.then(response => response.json())
					.then(json => {
						setLocations(json);
						setIsLoading(false);
					});
			});
	}, []);

	const createServer = (event) => {
		const createServerPromise = new Promise(async (resolve, reject) => {
			CreateServer(event).then(data => {
				if (data.success) {
					resolve()
					return MySwal.fire({
						icon: 'success',
						title: 'Success!',
						text: 'The server has been created!',
					}).then(() => {
						return navigate('/dashboard');
					});
				}
				if (data.error) {
					reject(data.error)
					return MySwal.fire({
						icon: 'error',
						title: 'Error',
						text: data.error,
					});
				}
			});
		})
		toast.promise(
			createServerPromise,
			{
				pending: 'Creating server...',
				success: 'The server has been created!',
				error: {
					render({ data }) {
						return <a>{data}</a>
					}
				}
			}
		)
	};

	return (
		<>
		<div className="col-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center"><b>Deploy a new server</b></h3>
                  <hr/>
				   {isLoading ? <p className="text-center"><b>Loading</b></p>
				   :
                  <form onSubmit={createServer} id="installForm">
                    <div className="form-group">
                      <label htmlFor="name">Server Name</label>
                      <input type="text" className="form-control text-white" name="name" id="name" placeholder=" " required/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="memory">Ram Allocated</label>
                      <input type="text" className="form-control text-white" name="ram" id="ram" placeholder=" "required/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="disk">Disk Allocated</label>
                      <input type="text" className="form-control text-white" name="disk" id="disk" placeholder=" "required/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="cpu">CPU Allocated</label>
                      <input type="text" className="form-control text-white" name="cpu" id="cpu" placeholder=" "required/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="location">Server Location</label>
                      <select className="form-control text-white" id="location" name="location">
					  {!!locations.length ?
						locations.map((location) =>
						<option>{location.name}</option>
					  ) : <option>There are no locations added to the client area.</option>
					}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="egg">Server Engine</label>
                      <select className="form-control text-white" id="egg" name="egg">
					      {!!eggs.length ?
							eggs.map((egg) =>
							<option>{egg.name}</option>
						  ) : <option>There are no eggs added to the client area.</option>
						}
                      </select>
                    </div>
					{!!eggs.length ?
						!!locations.length ?
						<button type="submit" className="btn btn-primary me-2">Continue</button>
						: <button type="submit" className="btn btn-primary me-2" disabled>Continue</button>
						: <button type="submit" className="btn btn-primary me-2" disabled>Continue</button>
									}
                    <Link to="/dashboard" className="btn btn-dark">Cancel</Link>
                  </form>
				  }
                </div>
              </div>
            </div>
		</>
	);
}
