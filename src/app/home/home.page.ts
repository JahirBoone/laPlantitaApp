import { Component, OnInit } from '@angular/core';
import * as IotApi from '@arduino/arduino-iot-client';
import * as rp from 'request-promise';

const pidHumedadSuelo = 'df46bc6d-b97e-48b7-9e17-fe00010c26d0';
const pidlvlpH = '31a412bc-f8e2-40a2-a533-ef8d25befd44';
const pidnadv = '6750664a-a39f-4b6b-9708-029ed1e4dec0';
const pidSolar = '6f2ef933-f193-4670-8e2d-3a91dca09923';
const pidTemperatura = 'de858a43-aa68-483e-9c0a-c7abdc44f37f';
const pidVPD = 'e759f01c-c6b5-4b2c-b976-fc2a09fdba05';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  humedadSuelo: any;
  lvlPH: any;
  luzSolar: any;
  temperatura: any;
  VPD: any;

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  async getToken(): Promise<string> {
    const options = {
      method: 'POST',
      url: 'https://api2.arduino.cc/iot/v1/clients/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      json: true,
      form: {
        grant_type: 'client_credentials',
        client_id: 'mvtyZ9f2iW5s6vhr4Mf1wp4YNW17gDeB',
        client_secret: 'ssaoQkIpxKavW50QD6IrkXvP1yLfLPLT6FtK4uA196AiRP4EKtCoWv39z5KiE8sQ',
        audience: 'https://api2.arduino.cc/iot'
      }
    };

    try {
      const response = await rp(options);
      return response['access_token']; // En esta variable se almacena el access token
    } catch (error) {
      console.error("Failed getting an access token: " + error);
      throw error;
    }
  }

  async api_request(pid: string): Promise<any> {
    const ArduinoIotClient = IotApi;
    const defaultClient = ArduinoIotClient.ApiClient.instance;

    // Configurar token de acceso OAuth2 para autorización: oauth2
    const oauth2 = defaultClient.authentications['oauth2'];
    oauth2.accessToken = await this.getToken();

    // Crear una instancia de la clase API
    const api = new ArduinoIotClient.PropertiesV2Api();
    const id = 'ca0282e4-7d0f-437f-83bd-1092a103d069'; // {String} El id del objeto
    const opts = {
      'showDeleted': false, // {Boolean} Si es verdadero, muestra las propiedades eliminadas
      'xOrganization': 'false' // {String} El id de la organización
    };

    const data = await api.propertiesV2Show(id, pid, opts);
    return data.last_value;
  }

  async loadData() {
    this.humedadSuelo = await this.var_Humedad_Suelo();
    this.lvlPH = await this.var_lvlPH();
    this.luzSolar = await this.var_luz_solar();
    this.temperatura = await this.var_temperatura();
    this.VPD = await this.var_VPD();
  }

  async var_Humedad_Suelo(): Promise<any> {
    return await this.api_request(pidHumedadSuelo);
  }

  async var_lvlPH(): Promise<any> {
    return await this.api_request(pidlvlpH);
  }

  async var_luz_solar(): Promise<any> {
    return await this.api_request(pidSolar);
  }

  async var_temperatura(): Promise<any> {
    return await this.api_request(pidTemperatura);
  }

  async var_VPD(): Promise<any> {
    return await this.api_request(pidVPD);
  }
}
