import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from "../../categories/shared/category.model";
import { CategoryService } from "../../categories/shared/category.service";

import { Entry } from "../../entries/shared/entry.model";
import { EntryService } from "../../entries/shared/entry.service";

import currencyFormatter from "currency-formatter"
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories)
  }

  public generateReports() {
    //pegando o calor atribuido no campo html referente ao mês
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!month || !year)
      alert("Você precisa selecionar o mês e o ano para gerar Relatórios");
    else
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this))
  }

  private setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let expanseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
      if (entry.type == 'revenue')
        revenueTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' }) //é necessário usar o unformat do currency pois o js n sabe somar numeros com ','
      else
        expanseTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' })
    });

    this.expenseTotal = currencyFormatter.format(expanseTotal, { code: 'BRL' });
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL' });
    this.balance = currencyFormatter.format(revenueTotal - expanseTotal, { code: 'BRL' });
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#E03131');
  }

  private getChartData(entrytype: string, title: string, color: string) {
    const chartData = []; //será um array de obj

    this.categories.forEach(category => {
      //filtrando laçamentos pela categoria e tipo
      const filteredEntries = this.entries.filter(
        entry => (entry.categoryId == category.id) && (entry.type == entrytype)
      );

      //se for encontrado lançamentos, então soma-se o valor dles e add ao chartdata
      //só irá mostrar categorias que tenham dados
      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL' }), 0
        )

        chartData.push({
          categoryName: category.nome,
          totalAmount: totalAmount
        })
      }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount)
      }]
    }
  }
}
