import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../api/dataService';

const DashboardContext = createContext();

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children }) => {
    const [festivals, setFestivals] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        selectedFestivalId: 'all',
        platform: 'all'
    });
    const [loading, setLoading] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const festData = await dataService.getFestivals();
                setFestivals(festData);
            } catch (error) {
                console.error("Failed to fetch festivals", error);
            }
        };
        fetchInitialData();
    }, []);

    const updateFilters = (newFilters) => {
        setFilters(prev => {
            const updated = { ...prev, ...newFilters };
            
            if (newFilters.selectedFestivalId && newFilters.selectedFestivalId !== 'all') {
                const selected = festivals.find(f => f.id.toString() === newFilters.selectedFestivalId.toString());
                if (selected) {
                    updated.startDate = selected.start_date;
                    updated.endDate = selected.end_date;
                }
            } else if (newFilters.selectedFestivalId === 'all') {
                updated.startDate = '2023-01-01';
                updated.endDate = '2023-12-31';
            }
            
            return updated;
        });
    };

    const triggerSeed = async () => {
        setIsSeeding(true);
        try {
            await dataService.seedDatabase();
            const festData = await dataService.getFestivals();
            setFestivals(festData);
            window.location.reload();
        } catch (error) {
            console.error("Seeding failed", error);
        } finally {
            setIsSeeding(false);
        }
    };

    const value = {
        festivals,
        filters,
        updateFilters,
        loading,
        setLoading,
        triggerSeed,
        isSeeding
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};