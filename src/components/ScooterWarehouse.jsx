import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useApp } from '../context/AppContext';

export function ScooterWarehouse() {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newScooter, setNewScooter] = useState({
        number: '',
        type: 'yandex',
    });

    const { state, dispatch } = useApp();

    const handleAddScooter = () => {
        if (!newScooter.number) return;

        const scooter = {
            id: Date.now(),
            number: newScooter.number,
            type: newScooter.type,
            status: 'in_stock',
        };

        dispatch({ type: 'ADD_SCOOTER', payload: scooter });
        setShowAddDialog(false);
        setNewScooter({ number: '', type: 'yandex' });
    };

    const handleDeleteScooter = (scooterId) => {
        dispatch({ type: 'DELETE_SCOOTER', payload: scooterId });
    };

    const inStockScooters = state.scooters.filter(scooter => scooter.status === 'in_stock');
    const yandexScooters = inStockScooters.filter(scooter => scooter.type === 'yandex');
    const sunRentScooters = inStockScooters.filter(scooter => scooter.type === 'sunRent');

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    Склад самокатов
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowAddDialog(true)}
                >
                    Добавить самокат
                </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Yandex: {yandexScooters.length} шт.
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    SunRent: {sunRentScooters.length} шт.
                </Typography>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер</TableCell>
                            <TableCell>Тип</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inStockScooters.map(scooter => (
                            <TableRow key={scooter.id}>
                                <TableCell>{scooter.number}</TableCell>
                                <TableCell>
                                    {scooter.type === 'yandex' ? 'Yandex' : 'SunRent'}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteScooter(scooter.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
                <DialogTitle>Добавить самокат</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Номер самоката"
                        fullWidth
                        value={newScooter.number}
                        onChange={(e) => setNewScooter({ ...newScooter, number: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Тип самоката</InputLabel>
                        <Select
                            value={newScooter.type}
                            label="Тип самоката"
                            onChange={(e) => setNewScooter({ ...newScooter, type: e.target.value })}
                        >
                            <MenuItem value="yandex">Yandex</MenuItem>
                            <MenuItem value="sunRent">SunRent</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddDialog(false)}>Отмена</Button>
                    <Button onClick={handleAddScooter} variant="contained">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 