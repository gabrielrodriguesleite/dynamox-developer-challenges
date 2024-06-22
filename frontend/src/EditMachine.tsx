import { EngineeringOutlined, EditOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetMachinesQuery,
  useUpdateMachineByIdMutation,
} from './features/monitor/monitorSlice';
import { MACHINE_TYPES } from './constants';
import UserCard from './components/UserCard';
import useAuth from './useAuth';

export default function EditMachine() {
  const location = useLocation();
  const n = useNavigate();
  const machineId = location.pathname.split('/')[2];

  const authContext = useAuth();
  const { data, refetch } = useGetMachinesQuery(authContext!.user.id);
  const [updateMachine, response] = useUpdateMachineByIdMutation();

  const machine = data?.find((i) => i.id === machineId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);

    updateMachine({
      id: machineId,
      name: `${d.get('name')}`,
      type: `${d.get('type')}`,
    })
      .unwrap()
      .then(() => {
        refetch().then(() => n('/machines'));
      })
      .catch((error: Error) => {
        alert('Error: try update later');
        console.log('Error: ', error);
      });
  };

  return (
    <Container component={'main'} maxWidth="xl">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Button variant="outlined" onClick={() => n('/machines')}>
            Back
          </Button>
        </Box>

        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <EngineeringOutlined />
        </Avatar>

        <Typography component="h1" variant="h5">
          Edit Machine
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem 0',
            alignSelf: 'stretch',
          }}
        >
          <FormControl fullWidth>
            <TextField
              name="name"
              label="New machine name"
              fullWidth
              autoFocus
              defaultValue={`${machine?.name}`}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="sslId">Type</InputLabel>
            <Select
              name="type"
              labelId="sslId"
              defaultValue={machine?.type}
              label="Type"
            >
              {MACHINE_TYPES.map((i: string | number, k: number) => (
                <MenuItem key={k} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="outlined">
            Save
          </Button>
        </Box>

        <UserCard />
      </Box>
    </Container>
  );
}

function MyEditableField(props: any) {
  const { text, edit } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
      }}
    >
      <Typography>{text}</Typography>
      <Button variant="outlined" onClick={edit}>
        <EditOutlined />
      </Button>
    </Box>
  );
}
