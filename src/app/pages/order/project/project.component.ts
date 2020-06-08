import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { OrderService } from 'src/app/core/order.service';
import { Operator, Addr, Project } from 'src/app/models/order.model';
import * as moment from 'moment';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  listOfData: Project[] = null;
  isLoading = true;
  pageSize: number;
  pageIndex: number;
  operators: Operator[] = null;
  addrs: Addr[] = null;
  total: number;

  selectedStartDate: string;
  selectedEndDate: string;
  selectedOperatorId: string = null;
  selectedAddrId: string = null;
  selectedActionId: string = null;
  selectedStatusId: string = null;

  constructor(
    private mservice: OrderService,
    private resolver: ComponentFactoryResolver,
    private viewContainer: ViewContainerRef
  ) {}

  loadData() {
    this.isLoading = true;
    this.mservice.getOrderProjects(this.filter).subscribe((p: any) => {
      this.total = p.headers.get('X-Total-Count');
      this.isLoading = false;
      this.listOfData = p.body;
    });
  }

  ngOnInit(): void {
    this.pageSize = 7;
    this.pageIndex = 1;
    this.loadData();
  }

  get filter(): any {
    let fiter: any = {};

    if (this.selectedStartDate) {
      fiter.startDate = this.selectedStartDate;
    }

    if (this.selectedEndDate) {
      fiter.endDate = this.selectedEndDate;
    }

    if (this.selectedAddrId) {
      fiter.addrId = this.selectedAddrId;
    }

    if (this.selectedActionId) {
      fiter.actionId = this.selectedActionId;
    }

    if (this.selectedOperatorId) {
      fiter.operatorId = this.selectedOperatorId;
    }

    if (this.selectedStatusId) {
      fiter.statusId = this.selectedStatusId;
    }

    if (this.pageIndex) {
      fiter.offset = (this.pageIndex - 1) * this.pageSize;
    }
    if (this.pageSize) {
      fiter.limit = this.pageSize;
    }

    return fiter;
  }

  set dateRange(range) {
    this.selectedStartDate =
      range.length > 0 ? moment(range[0]).format('YYYYMMDD') : null;
    this.selectedEndDate =
      range.length > 0 ? moment(range[1]).format('YYYYMMDD') : null;
  }

  makeDlg(): ComponentRef<ProjectDetailComponent> {
    const factory = this.resolver.resolveComponentFactory(
      ProjectDetailComponent
    );
    const detailComponentRef = this.viewContainer.createComponent(factory);
    detailComponentRef.instance.dataUpdate.subscribe(() => this.loadData());
    return detailComponentRef;
  }
  showAddDlg() {
    const detailComponentRef = this.makeDlg();
    detailComponentRef.instance.title = '新增日志';
    detailComponentRef.instance.project = null;
    detailComponentRef.instance.method = 'POST';
  }

  showEditDlg(project: Project) {
    const detailComponentRef = this.makeDlg();
    detailComponentRef.instance.title = '修改当前';
    detailComponentRef.instance.method = 'PUT';
    detailComponentRef.instance.project = project;
    detailComponentRef.instance.dataUpdate.subscribe(() => this.loadData());
  }

  onFilterClick() {
    this.loadData();
  }

  onPageIndexChange(index: number) {
    this.loadData();
  }

  deleteRecord(project: Project) {
    this.mservice.deleteOrderProject(project).subscribe(() => {
      this.loadData();
    });
  }
}