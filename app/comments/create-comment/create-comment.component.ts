import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Comment, CommentService } from "../../shared/index";
import { ListCommentComponent } from "../list-comment/list-comment.commponent";
@Component({
    moduleId: module.id,
    selector: "create-comment",
    templateUrl: "create-comment.component.html",
    styleUrls: ["create-comment.component.css"]
}) export class CreateCommentComponent implements OnInit {
    createCommentForm: FormGroup;
    errorMessage: string;
    comment: Comment = new Comment(null, null, null, null);

    formErrors = {
        "name": "",
        "message": ""
    };
    validationMessages = {
        "name": {
            "required": "Назовите себя"
        },
        "message": {
            "required": "Добавте свое сообщение"
        } 
    };
    @ViewChild(ListCommentComponent)
    list: ListCommentComponent;
    
    constructor(
        private commentService: CommentService,
        private fb: FormBuilder
    ) {}

    ngOnInit(){
        this.BuildForm();
    };
    BuildForm(){
        this.createCommentForm = this.fb.group({
            "name": [this.comment.userName, [Validators.required]],
            "message": [this.comment.comment, [Validators.required]]
        });

        this.createCommentForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
    };
    onValueChanged(data?: any){
        if(!this.createCommentForm) return;

        let form = this.createCommentForm;

        for (let item in this.formErrors){
            this.formErrors[item] = "";

            let control = form.get(item);

            if (control && control.dirty && !control.valid) {
                let message = this.validationMessages[item];

                for (let key in control.errors) {
                    this.formErrors[item] += message[key] + " ";
                };
            };
        };
    };
    createComment(createCommentForm: FormGroup) {
        
        this.comment.userName = createCommentForm.value.name;
        this.comment.comment = createCommentForm.value.message;
        this.comment.date = new Date();

        this.commentService.addComment(this.comment)
            .subscribe(
                () => {                    
                    this.createCommentForm = this.fb.group({
                        name: ["", Validators.required],
                        message: ["", Validators.required]
                    });  
                    this.list.refresh();                
                },
                error => this.errorMessage = error
            );            
    };
};