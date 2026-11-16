import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  INITIAL_USERS,
  INITIAL_LIMITS,
  INITIAL_BATCH,
  INITIAL_STOCK,
  INITIAL_ALERTS,
  INITIAL_READINGS_HISTORY,
  INITIAL_SHIFT_LOGS,
  INITIAL_AUDIT_TRAIL
} from '../data/mockData';
import { soundNotifier } from '../utils/audio';

const ProductionContext = createContext(null);

export const ProductionProvider = ({ children }) => {
  // 1. User & Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pharmapulse_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });
  const [users, setUsers] = useState(INITIAL_USERS);

  // 2. Limits Configuration
  const [limits, setLimits] = useState(() => {
    const saved = localStorage.getItem('pharmapulse_limits');
    return saved ? JSON.parse(saved) : INITIAL_LIMITS;
  });

  // 3. Batch Information
  const [batchInfo, setBatchInfo] = useState(INITIAL_BATCH);

  // 4. Fault-Tolerance & Redundancy Telemetry
  const [simulatedFault, setSimulatedFaultState] = useState('NONE');
  const [redundancyMode, setRedundancyMode] = useState('TMR'); // 'TMR' | 'DUAL_FAILOVER' | 'KALMAN'
  const [heartbeat, setHeartbeat] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Raw base values before noise/faults
  const [baseTelemetry, setBaseTelemetry] = useState({
    tempCore: 22.1,
    pressure: 42.4,
    flowRate: 15.3
  });

  // 5. Stock Items
  const [stockItems, setStockItems] = useState(() => {
    const saved = localStorage.getItem('pharmapulse_stock');
    return saved ? JSON.parse(saved) : INITIAL_STOCK;
  });

  // 6. Alerts
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('pharmapulse_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // 7. Readings History
  const [readingsHistory, setReadingsHistory] = useState(() => {
    const saved = localStorage.getItem('pharmapulse_readings');
    return saved ? JSON.parse(saved) : INITIAL_READINGS_HISTORY;
  });

  // 8. Shift Turnover Logs
  const [shiftLogs, setShiftLogs] = useState(() => {
    const saved = localStorage.getItem('pharmapulse_shift_logs');
    return saved ? JSON.parse(saved) : INITIAL_SHIFT_LOGS;
  });

  // 9. 21 CFR Part 11 Audit Trail
  const [auditTrail, setAuditTrail] = useState(() => {
    const saved = localStorage.getItem('pharmapulse_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_TRAIL;
  });

  // Helper: append audit log
  const logAuditEvent = useCallback((action, details, grade = 'Class A') => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const entry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      user: currentUser ? currentUser.name : 'System Controller',
      role: currentUser ? currentUser.role : 'System',
      action,
      details,
      grade
    };

    setAuditTrail((prev) => {
      const next = [entry, ...prev.slice(0, 150)];
      localStorage.setItem('pharmapulse_audit', JSON.stringify(next));
      return next;
    });
  }, [currentUser]);

  // Auth Functions
  const login = (userId, pin) => {
    const found = users.find((u) => u.id === userId && u.pin === pin);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('pharmapulse_user', JSON.stringify(found));
      logAuditEvent('USER_LOGIN', `User ${found.name} logged in successfully as ${found.role}.`);
      soundNotifier.playSuccessBeep();
      return { success: true };
    }
    return { success: false, message: 'Invalid User ID or Security PIN' };
  };

  const switchUser = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('pharmapulse_user', JSON.stringify(userObj));
    logAuditEvent('USER_SWITCH', `Switched active session to ${userObj.name} (${userObj.role}).`);
    soundNotifier.playSuccessBeep();
  };

  const logout = () => {
    if (currentUser) {
      logAuditEvent('USER_LOGOUT', `User ${currentUser.name} logged out.`);
    }
    setCurrentUser(null);
    localStorage.removeItem('pharmapulse_user');
  };

  const updateUserProfile = (updatedFields) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('pharmapulse_user', JSON.stringify(next));
      return next;
    });
    setUsers((prev) => prev.map((u) => (u.id === currentUser?.id ? { ...u, ...updatedFields } : u)));
    logAuditEvent('USER_PROFILE_UPDATE', `Updated user profile attributes for ${currentUser.name}.`);
  };

  // Helper: Status Evaluator against Limits
  const evaluateStatus = useCallback((metric, value) => {
    const limit = limits[metric];
    if (!limit) return 'Normal';

    if (value <= limit.criticalLow || value >= limit.criticalHigh) {
      return 'Critical';
    }
    if (value <= limit.warningLow || value >= limit.warningHigh) {
      return 'Warning';
    }
    return 'Normal';
  }, [limits]);

  // Compute Live Telemetry with Fault-Tolerance Simulation
  const liveTelemetry = useMemo(() => {
    // Generate micro noise for realism
    const noiseA = (Math.sin(heartbeat * 0.7) * 0.08);
    const noiseB = (Math.cos(heartbeat * 0.6) * 0.07);
    const noiseC = (Math.sin(heartbeat * 0.5) * 0.09);

    let tempA = parseFloat((baseTelemetry.tempCore + noiseA).toFixed(2));
    let tempB = parseFloat((baseTelemetry.tempCore + noiseB).toFixed(2));
    let tempC = parseFloat((baseTelemetry.tempCore + noiseC).toFixed(2));

    let sensorAStatus = 'ONLINE';
    let sensorBStatus = 'ONLINE';
    let sensorCStatus = 'ONLINE';
    let pressure = parseFloat((baseTelemetry.pressure + Math.sin(heartbeat * 0.4) * 0.3).toFixed(1));
    let flowRate = parseFloat((baseTelemetry.flowRate + Math.cos(heartbeat * 0.3) * 0.2).toFixed(1));
    let faultToleranceStatus = 'HEALTHY';
    let quorumDetails = '3 of 3 Sensors in Perfect Concordance';

    // Apply simulated fault injections
    if (simulatedFault === 'DRIFT_B') {
      tempB = parseFloat((tempB + 4.8).toFixed(2)); // Rogue sensor drift
      sensorBStatus = 'DRIFT_REJECTED';
      faultToleranceStatus = 'DEGRADED_TOLERATED';
      quorumDetails = 'TMR Quorum: Sensor B (+4.8°C drift) voted out. Maintained via Sensors A & C.';
    } else if (simulatedFault === 'FAIL_A') {
      tempA = 0.0; // Complete sensor loss
      sensorAStatus = 'DISCONNECTED';
      faultToleranceStatus = 'DEGRADED_TOLERATED';
      quorumDetails = 'Failover Active: Sensor A offline. Switched to Hot-Standby Sensor B & C.';
    } else if (simulatedFault === 'TEMP_SPIKE') {
      tempA = parseFloat((tempA + 5.2).toFixed(2));
      tempB = parseFloat((tempB + 5.3).toFixed(2));
      tempC = parseFloat((tempC + 5.1).toFixed(2));
      faultToleranceStatus = 'CRITICAL_CONDITION';
      quorumDetails = 'True Chamber Excursion: All 3 sensors agree on thermal excursion!';
    } else if (simulatedFault === 'PRESSURE_DROP') {
      pressure = 16.5; // Critical airlock loss
      faultToleranceStatus = 'PRESSURE_BREACH';
      quorumDetails = 'Cleanroom Differential Pressure collapsed below 18.0 Pa boundary!';
    }

    // TMR (Triple Modular Redundancy) 2-out-of-3 Voting Algorithm
    let consensusTemp = 0;
    const driftTol = limits.temperature.driftTolerance || 0.8;

    if (sensorAStatus === 'DISCONNECTED') {
      // 2 sensors remaining
      consensusTemp = parseFloat(((tempB + tempC) / 2).toFixed(2));
    } else if (sensorBStatus === 'DRIFT_REJECTED') {
      // 2 sensors remaining
      consensusTemp = parseFloat(((tempA + tempC) / 2).toFixed(2));
    } else {
      // Calculate pair-wise differences
      const diffAB = Math.abs(tempA - tempB);
      const diffBC = Math.abs(tempB - tempC);
      const diffAC = Math.abs(tempA - tempC);

      if (diffAB <= driftTol && diffAC <= driftTol && diffBC <= driftTol) {
        // All three in agreement
        consensusTemp = parseFloat(((tempA + tempB + tempC) / 3).toFixed(2));
        faultToleranceStatus = 'HEALTHY';
      } else if (diffAB <= driftTol) {
        // A & B agree, C is outlier
        consensusTemp = parseFloat(((tempA + tempB) / 2).toFixed(2));
        sensorCStatus = 'OUTLIER_REJECTED';
        faultToleranceStatus = 'DEGRADED_TOLERATED';
        quorumDetails = 'TMR: Sensor C rejected as outlier. Voted via Sensor A & B.';
      } else if (diffAC <= driftTol) {
        // A & C agree, B is outlier
        consensusTemp = parseFloat(((tempA + tempC) / 2).toFixed(2));
        sensorBStatus = 'OUTLIER_REJECTED';
        faultToleranceStatus = 'DEGRADED_TOLERATED';
        quorumDetails = 'TMR: Sensor B rejected as outlier. Voted via Sensor A & C.';
      } else if (diffBC <= driftTol) {
        // B & C agree, A is outlier
        consensusTemp = parseFloat(((tempB + tempC) / 2).toFixed(2));
        sensorAStatus = 'OUTLIER_REJECTED';
        faultToleranceStatus = 'DEGRADED_TOLERATED';
        quorumDetails = 'TMR: Sensor A rejected as outlier. Voted via Sensor B & C.';
      } else {
        // Median voting fallback
        const sorted = [tempA, tempB, tempC].sort((a, b) => a - b);
        consensusTemp = sorted[1];
        faultToleranceStatus = 'DIVERGENCE_WARNING';
        quorumDetails = 'Sensor divergence high. Median fallback utilized.';
      }
    }

    // Health Score calculation
    let healthScore = 99.4;
    if (faultToleranceStatus === 'DEGRADED_TOLERATED') healthScore -= 12.0;
    if (faultToleranceStatus === 'CRITICAL_CONDITION') healthScore -= 45.0;
    if (faultToleranceStatus === 'PRESSURE_BREACH') healthScore -= 40.0;
    if (evaluateStatus('temperature', consensusTemp) !== 'Normal') healthScore -= 15.0;
    if (evaluateStatus('pressure', pressure) !== 'Normal') healthScore -= 15.0;

    healthScore = Math.max(10, Math.min(100, parseFloat(healthScore.toFixed(1))));

    return {
      tempA,
      tempB,
      tempC,
      consensusTemp,
      sensorAStatus,
      sensorBStatus,
      sensorCStatus,
      pressure,
      flowRate,
      healthScore,
      faultToleranceStatus,
      quorumDetails
    };
  }, [baseTelemetry, simulatedFault, heartbeat, limits, evaluateStatus]);

  // Tick Heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartbeat((h) => (h + 1) % 10000);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Set Simulated Fault with Audio Cue and Audit Log
  const setSimulatedFault = (faultType) => {
    setSimulatedFaultState(faultType);
    if (faultType === 'NONE') {
      logAuditEvent('FAULT_RESET', 'Cleared simulated faults. System returned to nominal operating conditions.');
      soundNotifier.playSuccessBeep();
    } else {
      logAuditEvent('FAULT_INJECTION_SIM', `Injected fault scenario: ${faultType}.`);
      if (faultType === 'TEMP_SPIKE' || faultType === 'PRESSURE_DROP') {
        soundNotifier.playCriticalAlarm();
      } else {
        soundNotifier.playWarningChime();
      }
    }
  };

  // Limit Updating (Admin only)
  const updateLimits = (newLimits, reason) => {
    setLimits(newLimits);
    localStorage.setItem('pharmapulse_limits', JSON.stringify(newLimits));
    logAuditEvent('SPECIFICATION_LIMITS_UPDATED', `Limits reconfigured by ${currentUser.name}. Reason: ${reason}`);
    soundNotifier.playSuccessBeep();
  };

  // Add Production Reading (Module 3)
  const addProductionReading = (readingData) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    const status = evaluateStatus('temperature', readingData.consensusTemp);

    const newReading = {
      id: `RDG-${Date.now().toString().slice(-4)}`,
      timestamp,
      batchId: readingData.batchId || batchInfo.id,
      line: readingData.line || batchInfo.line,
      tempA: parseFloat(readingData.tempA),
      tempB: parseFloat(readingData.tempB),
      tempC: parseFloat(readingData.tempC),
      consensusTemp: parseFloat(readingData.consensusTemp),
      pressure: parseFloat(readingData.pressure),
      flowRate: parseFloat(readingData.flowRate),
      status,
      operator: currentUser ? currentUser.name : 'Unassigned Operator',
      notes: readingData.notes || 'Routine GMP scheduled verification.'
    };

    setReadingsHistory((prev) => {
      const next = [newReading, ...prev];
      localStorage.setItem('pharmapulse_readings', JSON.stringify(next));
      return next;
    });

    logAuditEvent('PRODUCTION_READING_LOGGED', `Batch ${newReading.batchId}: Temp ${newReading.consensusTemp}°C [Status: ${status}], Pressure ${newReading.pressure} Pa.`);

    if (status === 'Critical') {
      soundNotifier.playCriticalAlarm();
      // Auto trigger alert
      triggerNewAlert({
        type: 'Temperature',
        severity: 'Critical',
        title: `Critical Temperature Excursion: ${newReading.consensusTemp}°C`,
        message: `Reading on ${newReading.line} reached ${newReading.consensusTemp}°C (Threshold: <${limits.temperature.criticalLow}°C or >${limits.temperature.criticalHigh}°C).`,
        source: 'Production Entry Form'
      });
    } else if (status === 'Warning') {
      soundNotifier.playWarningChime();
      triggerNewAlert({
        type: 'Temperature',
        severity: 'Warning',
        title: `Warning Temperature Shift: ${newReading.consensusTemp}°C`,
        message: `Reading on ${newReading.line} in warning range (${newReading.consensusTemp}°C).`,
        source: 'Production Entry Form'
      });
    } else {
      soundNotifier.playSuccessBeep();
    }

    return newReading;
  };

  // Stock Management (Module 6)
  const addStockItem = (item) => {
    const newItem = {
      id: `STK-${Date.now().toString().slice(-4)}`,
      ...item,
      quantity: parseFloat(item.quantity),
      minThreshold: parseFloat(item.minThreshold)
    };

    // Calculate initial status
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      newItem.status = 'Expired';
    } else if (diffDays <= 30) {
      newItem.status = 'Expiring Soon';
    } else if (newItem.quantity <= newItem.minThreshold) {
      newItem.status = 'Low Stock';
    } else {
      newItem.status = 'Adequate';
    }

    setStockItems((prev) => {
      const next = [newItem, ...prev];
      localStorage.setItem('pharmapulse_stock', JSON.stringify(next));
      return next;
    });

    logAuditEvent('STOCK_ITEM_ADDED', `Added material: ${newItem.name} (Lot: ${newItem.lotNumber}, Qty: ${newItem.quantity} ${newItem.unit}).`);

    if (newItem.status === 'Expired') {
      triggerNewAlert({
        type: 'Stock',
        severity: 'Critical',
        title: `Expired Material Added: ${newItem.name}`,
        message: `Lot ${newItem.lotNumber} has already expired on ${newItem.expiryDate}. Immediate quarantine recommended.`,
        source: 'Stock Control Management'
      });
    } else if (newItem.status === 'Expiring Soon') {
      triggerNewAlert({
        type: 'Stock',
        severity: 'Warning',
        title: `Material Expiring Soon: ${newItem.name}`,
        message: `Lot ${newItem.lotNumber} expires in ${diffDays} days (${newItem.expiryDate}).`,
        source: 'Stock Control Management'
      });
    }

    soundNotifier.playSuccessBeep();
    return newItem;
  };

  const updateStockQuantity = (id, delta, actionType, reason) => {
    setStockItems((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, parseFloat((item.quantity + delta).toFixed(2)));
          
          const expiryDate = new Date(item.expiryDate);
          const today = new Date();
          const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

          let newStatus = item.status;
          if (diffDays <= 0) {
            newStatus = 'Expired';
          } else if (diffDays <= 30) {
            newStatus = 'Expiring Soon';
          } else if (newQty <= item.minThreshold) {
            newStatus = 'Low Stock';
          } else {
            newStatus = 'Adequate';
          }

          logAuditEvent('STOCK_QUANTITY_UPDATED', `${actionType} on ${item.name}: changed by ${delta > 0 ? '+' : ''}${delta} ${item.unit} to ${newQty} ${item.unit}. Reason: ${reason}`);

          if (newStatus === 'Low Stock' && item.status !== 'Low Stock') {
            triggerNewAlert({
              type: 'Stock',
              severity: 'Warning',
              title: `Low Stock Level: ${item.name}`,
              message: `Inventory for ${item.name} dropped to ${newQty} ${item.unit} (Threshold: ${item.minThreshold} ${item.unit}).`,
              source: 'Inventory Depletion Tracker'
            });
          }

          return { ...item, quantity: newQty, status: newStatus };
        }
        return item;
      });
      localStorage.setItem('pharmapulse_stock', JSON.stringify(next));
      return next;
    });
    soundNotifier.playSuccessBeep();
  };

  // Alert Management (Module 7)
  const triggerNewAlert = (alertData) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      timestamp,
      status: 'Active',
      acknowledgedBy: null,
      resolution: null,
      ...alertData
    };

    setAlerts((prev) => {
      const next = [newAlert, ...prev];
      localStorage.setItem('pharmapulse_alerts', JSON.stringify(next));
      return next;
    });
    return newAlert;
  };

  const acknowledgeAlert = (id) => {
    const operatorName = currentUser ? `${currentUser.name} (${currentUser.badgeId})` : 'Operator';
    setAlerts((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status: 'Acknowledged', acknowledgedBy: operatorName } : a));
      localStorage.setItem('pharmapulse_alerts', JSON.stringify(next));
      return next;
    });
    logAuditEvent('ALERT_ACKNOWLEDGED', `Alert ${id} acknowledged by ${operatorName}.`);
    soundNotifier.playSuccessBeep();
  };

  const resolveAlert = (id, resolutionText) => {
    const operatorName = currentUser ? `${currentUser.name} (${currentUser.badgeId})` : 'Operator';
    setAlerts((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status: 'Resolved', resolution: `${resolutionText} (Closed by ${operatorName})` } : a));
      localStorage.setItem('pharmapulse_alerts', JSON.stringify(next));
      return next;
    });
    logAuditEvent('ALERT_RESOLVED', `Alert ${id} resolved with CAPA: "${resolutionText}" by ${operatorName}.`);
    soundNotifier.playSuccessBeep();
  };

  // Shift Logs (Module 5)
  const addShiftLog = (shiftData) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newLog = {
      id: `SFT-${Date.now().toString().slice(-4)}`,
      date: timestamp.split(' ')[0],
      shift: shiftData.shift,
      leadOperator: currentUser ? `${currentUser.name} (${currentUser.badgeId})` : 'Operator',
      readingsLogged: shiftData.readingsLogged || readingsHistory.length,
      meanTemp: `${liveTelemetry.consensusTemp}°C`,
      meanPressure: `${liveTelemetry.pressure} Pa`,
      deviationsCount: shiftData.deviationsCount || 0,
      handoverSummary: shiftData.handoverSummary,
      signedAt: timestamp,
      verifiedBy: 'Pending QA Verification'
    };

    setShiftLogs((prev) => {
      const next = [newLog, ...prev];
      localStorage.setItem('pharmapulse_shift_logs', JSON.stringify(next));
      return next;
    });

    logAuditEvent('SHIFT_HANDOVER_EXECUTED', `Shift handover logged for ${newLog.shift} by ${newLog.leadOperator}.`);
    soundNotifier.playSuccessBeep();
    return newLog;
  };

  // Audio Toggle
  const toggleAudio = () => {
    const muted = soundNotifier.toggleMute();
    setIsMuted(muted);
  };

  // Reset to Demo Defaults
  const resetAllData = () => {
    localStorage.clear();
    setLimits(INITIAL_LIMITS);
    setStockItems(INITIAL_STOCK);
    setAlerts(INITIAL_ALERTS);
    setReadingsHistory(INITIAL_READINGS_HISTORY);
    setShiftLogs(INITIAL_SHIFT_LOGS);
    setAuditTrail(INITIAL_AUDIT_TRAIL);
    setCurrentUser(INITIAL_USERS[0]);
    setSimulatedFaultState('NONE');
    logAuditEvent('SYSTEM_RESET', 'Factory demo state restored.');
    soundNotifier.playSuccessBeep();
  };

  const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length;

  return (
    <ProductionContext.Provider
      value={{
        currentUser,
        users,
        login,
        switchUser,
        logout,
        updateUserProfile,
        limits,
        updateLimits,
        evaluateStatus,
        batchInfo,
        setBatchInfo,
        telemetry: liveTelemetry,
        redundancyMode,
        setRedundancyMode,
        simulatedFault,
        setSimulatedFault,
        heartbeat,
        stockItems,
        addStockItem,
        updateStockQuantity,
        alerts,
        activeAlertsCount,
        acknowledgeAlert,
        resolveAlert,
        triggerNewAlert,
        readingsHistory,
        addProductionReading,
        shiftLogs,
        addShiftLog,
        auditTrail,
        logAuditEvent,
        isMuted,
        toggleAudio,
        resetAllData
      }}
    >
      {children}
    </ProductionContext.Provider>
  );
};

export const useProduction = () => {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error('useProduction must be used within a ProductionProvider');
  }
  return context;
};
