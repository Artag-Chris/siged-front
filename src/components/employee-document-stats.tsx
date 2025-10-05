"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';

interface EmployeeDocumentStatsProps {
  employeeUuid: string;
  refreshTrigger?: number;
}

interface DocumentStats {
  total: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  totalSize: number;
  recentUploads: number; 
}

const EmployeeDocumentStats: React.FC<EmployeeDocumentStatsProps> = ({
  employeeUuid,
  refreshTrigger = 0
}) => {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL|| 'localhost:3000';

 

  const fetchStats = async () => {
    setLoading(true);
    try {
      const statsUrl = `${API_BASE_URL}/api/retrieval/employee/${employeeUuid}?limit=100`;

      const response = await fetch(statsUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const documents = data.documents || [];
      const byType: Record<string, number> = {};
      const byCategory: Record<string, number> = {};
      let totalSize = 0;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      let recentUploads = 0;

      documents.forEach((doc: any) => {
        
        const type = doc.documentType || 'sin-tipo';
        byType[type] = (byType[type] || 0) + 1;

        const category = doc.category || 'sin-categoria';
        byCategory[category] = (byCategory[category] || 0) + 1;

        totalSize += doc.size || 0;

        if (new Date(doc.uploadDate) > oneWeekAgo) {
          recentUploads++;
        }
      });

      setStats({
        total: documents.length,
        byType,
        byCategory,
        totalSize,
        recentUploads
      });

    } catch (error: any) {
      let errorMessage = 'Error fetching document stats';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Error de conexión al obtener estadísticas';
      } else if (error.message.includes('HTTP')) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message || errorMessage;
      }
      
   
      if (error.message.includes('404') || errorMessage.includes('404')) {       
        setLoading(false);
        return;
      }
      
      console.error('Error fetching document stats:', errorMessage, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeUuid) {
      fetchStats();
    }
  }, [employeeUuid, refreshTrigger]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Cargando estadísticas...</span>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total documentos */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documentos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tamaño total */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Tamaño Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recientes */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Últimos 7 días</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentUploads}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipos más comunes */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Tipos</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(stats.byType)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 2)
                  .map(([type, count]) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}: {count}
                    </Badge>
                  ))
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDocumentStats;