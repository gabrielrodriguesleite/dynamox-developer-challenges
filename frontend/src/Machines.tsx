import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useGetMachinesQuery } from './features/monitor/monitorSlice';
import { MachineType } from './MachineCard';
import CreateMachine from './CreateMachine';
import UserCard from './components/UserCard';
import useAuth from './useAuth';

import DeleteIcon from '@mui/icons-material/Delete';
import Create from '@mui/icons-material/Create';
import Add from '@mui/icons-material/Add';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteMachineById } from './utils/requests';

type GridColDef = { field: string; headerName: string; width: number };

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Machine Name', width: 150 },
  { field: 'type', headerName: 'Machine Type', width: 150 },
];

export default function Machines() {
  const n = useNavigate();
  const authContext = useAuth();
  const { data, refetch } = useGetMachinesQuery(authContext!.user.id);
  const [sel, setSel] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const rows: MachineType[] = data || [];

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Typography component="h1" variant="h5">
          Machines
        </Typography>
        <DataGrid
          sx={{
            m: 0,
            p: 0,
            width: '100%',
          }}
          onCellClick={(e) => {
            setSel(`${e.id}`);
          }}
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          paginationMode="client"
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => n('/add-machine')}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            startIcon={<Create />}
            disabled={sel == null}
            // TODO onClick={}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            disabled={sel == null}
            onClick={() => setShowConfirmDelete(true)}
          >
            Delete
          </Button>
          <Dialog
            sx={{ textAlign: 'center' }}
            open={showConfirmDelete}
            onClose={() => setShowConfirmDelete(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContentText>
              Are you sure you want to delete this machine?
            </DialogContentText>
            <DialogActions>
              <Button onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteMachineById(
                    `${sel}`,
                    () => {
                      setShowConfirmDelete(false);
                      refetch();
                    },
                    (error) => {
                      setShowConfirmDelete(false);
                      alert(
                        `Error trying to delete a machine. Please try again later...`
                      );
                      console.log(error);
                      refetch();
                    }
                  );
                }}
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <UserCard />
    </Container>
  );
}
