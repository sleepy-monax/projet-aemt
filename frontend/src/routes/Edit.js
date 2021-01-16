import {
    mdiCheckboxBlankOutline,
    mdiCheckboxMarked,
    mdiCheckCircle,
    mdiCheckCircleOutline,
    mdiCircleOutline,
    mdiEmail,
    mdiFormatListChecks,
    mdiPrinter,
    mdiTrophy,
    mdiUnfoldLessHorizontal,
    mdiUnfoldMoreHorizontal,
} from "@mdi/js";

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Icon from "@mdi/react";

import { FindSectionFromBlocId } from "../services/SectionService";
import { FindStudentById, UpdateStudent } from "../services/StudentsService";
import { OutlineWhite } from "../components/Styles";
import Button from "../components/Button";
import DetailButton from "../components/DetailButton";
import Header from "../components/Hearder";
import Loading from "../components/Loading";

import {
    StudentHasValidatedAA,
    StudentHasValidatedBloc,
    StudentHasValidatedUE,
} from "../model/Student";
import { SectionFindAA, SectionFindUE } from "../model/Section";

function Checkbox(props) {
    return (
        <Icon
            className="text-helha_blue cursor-pointer select-none"
            path={props.checked ? mdiCheckboxMarked : mdiCheckboxBlankOutline}
            size={1}
            onClick={() => {
                props.onChange(!props.checked);
            }}
        />
    );
}

function AA(props) {
    let aaInfos = SectionFindAA(props.section, props.aaId);

    let icon = undefined;

    if (StudentHasValidatedAA(props.student, props.aaId)) {
        icon = (
            <Icon
                className="text-helha_grey dark:text-white"
                path={mdiCheckCircle}
                size={1}
            />
        );
    } else if (StudentHasValidatedUE(props.student, props.ueId)) {
        icon = (
            <Icon
                className="text-helha_grey dark:text-white"
                path={mdiCheckCircleOutline}
                size={1}
            />
        );
    } else {
        icon = (
            <Icon
                className="text-helha_grey dark:text-white"
                path={mdiCircleOutline}
                size={1}
            />
        );
    }

    return (
        <div className="gap-4 flex items-center">
            <div className="flex-1">{aaInfos.name}</div>
            {icon}
        </div>
    );
}

function UE(props) {
    let ue = props.ue;
    let ueInfos = SectionFindUE(props.section, ue.ref);

    const [expended, setExpended] = useState(false);

    let expender = (
        <Icon
            path={expended ? mdiUnfoldLessHorizontal : mdiUnfoldMoreHorizontal}
            size={1}
        />
    );

    let aasList;

    if (expended) {
        aasList = ue.aas.map((aa, index) => (
            <AA
                key={index}
                aa={aa}
                student={props.student}
                section={props.section}
                ueId={ue.ref}
                aaId={aa.ref}
                aaName={aa.name}
            />
        ));
    }

    let icon = "";

    if (StudentHasValidatedUE(props.student, ue.ref)) {
        icon = (
            <Icon
                className="text-helha_grey dark:text-white"
                path={mdiTrophy}
                size={1}
            />
        );
    } else {
        icon = (
            <Checkbox
                checked={props.ue.inPAE}
                onChange={(value) => {
                    let ueCopy = props.ue;
                    ueCopy.inPAE = value;

                    props.onChange(ueCopy);
                }}
            />
        );
    }

    let header = (
        <div className={"flex " + (expended ? "mb-4" : "")}>
            <div
                className="flex flex-1 gap-4 select-none cursor-pointer "
                onClick={() => {
                    setExpended(!expended);
                }}
            >
                {expender}

                <div className={expended ? "font-bold" : ""}>
                    {ueInfos.name}
                </div>
            </div>

            {icon}
        </div>
    );

    return (
        <div
            className={
                "transition-all p-4 my-2 flex flex-col rounded " +
                (expended ? "bg-white dark:bg-helha_grey shadow" : "")
            }
        >
            {header}

            <div className="pl-10 flex gap-2 flex-col">{aasList}</div>
        </div>
    );
}

function Bloc(props) {
    let bloc = props.bloc;

    const [ues, setUES] = useState(props.student.ues);

    if (StudentHasValidatedBloc(props.student, bloc.id)) {
        return (
            <div className="text-helha_blue pt-4 pb-2 text-2xl px-4 border-helha_blue mb-4 flex items-center">
                <div className="flex-1">{bloc.name.toUpperCase()}</div>
                <Icon className="text-helha_blue" path={mdiTrophy} size={1} />
            </div>
        );
    }

    return (
        <>
            <div className="text-helha_blue pt-4 pb-2 text-2xl  px-4 border-b-2 border-helha_blue mb-4">
                {bloc.name.toUpperCase()}
            </div>

            {ues
                .filter((ue) => ue.bloc === bloc.id)
                .map((ue, index) => (
                    <UE
                        key={index}
                        ue={ue}
                        section={props.section}
                        student={props.student}
                        onChange={(ue) => {
                            let uesCopy = [...ues];

                            for (let i = 0; i < uesCopy.length; i++) {
                                if (uesCopy[i].ref === ue.ref) {
                                    uesCopy[i] = ue;
                                }
                            }

                            let copyStudent = props.student;
                            copyStudent.ues = uesCopy;
                            setUES(uesCopy);

                            props.onChange(copyStudent);
                        }}
                    />
                ))}
        </>
    );
}

export default function Edit() {
    let { studentId } = useParams();
    const [student, SetStudent] = useState(false);
    const [section, SetSection] = useState(false);

    useEffect(() => {
        if (!student) {
            FindStudentById(studentId).then((fetchedStudent) => {
                SetStudent(fetchedStudent);

                FindSectionFromBlocId(
                    fetchedStudent.bloc
                ).then((fetchedSection) => SetSection(fetchedSection));
            });
        }
    });

    if (student === false || section === false) {
        return <Loading />;
    }

    return (
        <div className="bg-gray-100 dark:bg-helha_dark_grey flex-1">
            <Header
                icon={mdiFormatListChecks}
                title={student.firstname + " " + student.lastname}
                description={
                    "Bachelier en " +
                    section.name.toLowerCase() +
                    " · " +
                    student.bloc.toUpperCase()
                }
            >
                <DetailButton text="Confirmer" detail="60 Crédits" />

                <Button
                    variante={OutlineWhite}
                    text="Imprimer"
                    icon={mdiPrinter}
                />
                <Button
                    variante={OutlineWhite}
                    text="Envoyer"
                    icon={mdiEmail}
                />
            </Header>

            <div className="max-w-2xl mx-auto my-8">
                {section.blocs.map((bloc, index) => (
                    <Bloc
                        key={index}
                        bloc={bloc}
                        student={student}
                        section={section}
                        onChange={(student) => {
                            SetStudent(student);
                            UpdateStudent(student);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
