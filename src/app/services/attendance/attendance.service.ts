import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private attendanceApiurl = 'http://localhost:3000/attendance';

  constructor(private http: HttpClient) { }
}
