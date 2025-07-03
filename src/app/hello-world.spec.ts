import { TestBed } from '@angular/core/testing';
import { HelloWorldComponent } from './hello-world.component';

describe('HelloWorldComponent', () => {
	let component: HelloWorldComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [HelloWorldComponent]
		});
		component = TestBed.createComponent(HelloWorldComponent).componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should return "Hello, World!"', () => {
		expect(component.sayHello()).toEqual('Hello, World!');
	});
});