import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { OrderService } from 'src/app/core/services/order.service';
import { Operator, Addr, Project } from 'src/app/models/order.model';
import * as moment from 'moment';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { NzMessageService } from 'ng-zorro-antd';

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
    private viewContainer: ViewContainerRef,
    private messageService: NzMessageService
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
    let filter: any = {};

    if (this.selectedStartDate) {
      filter.startDate = this.selectedStartDate;
    }

    if (this.selectedEndDate) {
      filter.endDate = this.selectedEndDate;
    }

    if (this.selectedAddrId) {
      filter.addrId = this.selectedAddrId;
    }

    if (this.selectedActionId) {
      filter.actionId = this.selectedActionId;
    }

    if (this.selectedOperatorId) {
      filter.operatorId = this.selectedOperatorId;
    }

    if (this.selectedStatusId) {
      filter.statusId = this.selectedStatusId;
    }

    if (this.pageIndex) {
      filter.offset = (this.pageIndex - 1) * this.pageSize;
    }
    if (this.pageSize) {
      filter.limit = this.pageSize;
    }

    return filter;
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
    detailComponentRef.instance.dataUpdate.subscribe(() => {
      this.messageService.info('新增成功');
      this.loadData();
    });
  }

  showEditDlg(project: Project) {
    const detailComponentRef = this.makeDlg();
    detailComponentRef.instance.title = '修改当前';
    detailComponentRef.instance.method = 'PUT';
    detailComponentRef.instance.project = project;
    detailComponentRef.instance.dataUpdate.subscribe(() => this.loadData());
    detailComponentRef.instance.dataUpdate.subscribe(() => {
      this.messageService.info('修改成功');
      this.loadData();
    });
  }

  onFilterClick() {
    this.loadData();
  }

  onPageIndexChange(index: number) {
    this.loadData();
  }

  deleteRecord(project: Project) {
    this.mservice.deleteOrderProject(project).subscribe(() => {
      this.messageService.info('删除成功');
      this.loadData();
    });
  }
}
