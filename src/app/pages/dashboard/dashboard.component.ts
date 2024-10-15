import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { AuditoriaService } from '../../services/auditoria.service';
import { AccesoService } from '../../services/acceso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  progressBarAcceso: number = 0;
  progressBarAccesoExitoso: number = 0;
  progressBarIncidencias: number = 0;
  progressBarComentarios: number = 0;

  totalAccesos: number = 0;
  totalAccesosExitosos: number = 0;

  totalUsuarios: number = 0;
  totalAlumnos: number = 0;
  totalDocentes: number = 0;
  totalAdministradores: number = 0;
  totalIncidencias: number = 0;
  totalIncidenciasResueltas: number = 0;
  totalIncidenciasPendientes: number = 0;
  totalComentarios: number = 0;

  constructor(
    private auditoriaService: AuditoriaService,
    private accesoService: AccesoService
  ) { }

  ngOnInit(): void {
    this.obtenerDatosAuditoria();
    this.obtenerDatosAcceso();
    this.iniciarGrafica();
  }

  obtenerDatosAcceso() {
    this.accesoService.obtenerAccesos().subscribe({
      next: (response) => {
        this.totalAccesos = response.totalAccesos;
        // Calcula el porcentaje de accesos para el ProgressBar
        this.progressBarAcceso = (response.totalAccesos / 100) * 100;

        this.totalAccesosExitosos = response.totalAccesosExitosos;
        // Calcula el porcentaje de accesos exitosos para el ProgressBar
        this.progressBarAccesoExitoso = (response.totalAccesosExitosos / 100) * 100;

        // Actualiza la gráfica después de obtener los datos
        this.actualizarGrafica();
      },
      error: (err) => {
        console.error('Error al obtener total de accesos:', err);
      }
    });
  }

  obtenerDatosAuditoria() {
    // Obtener total de usuarios
    this.auditoriaService.obtenerTotalUsuarios().subscribe({
      next: (response) => {
        this.totalUsuarios = response.totalUsuarios;
        this.totalAlumnos = response.totalAlumnos;
        this.totalDocentes = response.totalDocentes;
        this.totalAdministradores = response.totalAdministradores;
      },
      error: (err) => {
        console.error('Error al obtener totales de usuarios:', err);
      }
    });

    // Obtener total de incidencias y comentarios
    this.auditoriaService.obtenerTotalIncidenciasComentarios().subscribe({
      next: (response) => {
        this.totalIncidencias = response.totalIncidencias;
        // Calcula el porcentaje de incidencias resueltas para el ProgressBar
        this.progressBarIncidencias = (response.totalIncidencias / 100) * 100;

        this.totalIncidenciasResueltas = response.totalIncidenciasResueltas;
        this.totalIncidenciasPendientes = response.totalIncidenciasPendientes;

        this.totalComentarios = response.totalComentarios;
        // Calcula el porcentaje de comentarios para el ProgressBar
        this.progressBarComentarios = (response.totalComentarios / 100) * 100;

        // Actualiza la gráfica después de obtener los datos
        this.actualizarGrafica();
      },
      error: (err) => {
        console.error('Error al obtener totales de incidencias y comentarios:', err);
      }
    });
  }

  iniciarGrafica() {
    const chartDom = document.getElementById('chart-container')!;
    const myChart = echarts.init(chartDom);
    this.setGraficaOptions(myChart);
  }

  actualizarGrafica() {
    const chartDom = document.getElementById('chart-container')!;
    const myChart = echarts.init(chartDom);
    this.setGraficaOptions(myChart);
  }

  setGraficaOptions(myChart: any) {
    const option: echarts.EChartsOption = {
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          // restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      tooltip: { // Configuración del tooltip
        trigger: 'item', // Muestra el tooltip al pasar sobre los elementos
        formatter: '{b}: {c} ({d}%)', // Formato del tooltip
        extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);' // Estilo adicional
      },
      series: [
        {
          name: 'Auditoria',
          type: 'pie',
          radius: [50, 250],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: this.totalAccesos, name: 'Total Accesos', itemStyle: { color: '#00C292' } },
            { value: this.totalAccesosExitosos, name: 'Total Accesos Exitosos', itemStyle: { color: '#AB8CE4' } },
            { value: this.totalComentarios, name: 'Total Comentarios', itemStyle: { color: '#03A9F3' } },
            { value: this.totalIncidencias, name: 'Total Incidencias', itemStyle: { color: '#FB9678' } },
            // Aquí puedes agregar más datos según sea necesario
          ]
        }
      ]
    };
    option && myChart.setOption(option);
  }
}
