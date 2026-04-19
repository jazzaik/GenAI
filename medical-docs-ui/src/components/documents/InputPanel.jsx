import { useState } from 'react';
import { User, Calendar, Stethoscope, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import Button from '../shared/Button.jsx';
import Alert from '../shared/Alert.jsx';

const FIELD = ({ label, value, id, type = 'text', required }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-medium text-neutral-600 mb-1">
      {label}{required && <span className="text-danger-500 ml-0.5" aria-label="required">*</span>}
    </label>
    <input
      id={id}
      type={type}
      defaultValue={value}
      required={required}
      className="w-full h-8 px-2.5 text-sm rounded border border-neutral-200 bg-white
                 text-neutral-800 placeholder:text-neutral-400
                 focus:outline-none focus:border-primary-400 focus:shadow-focus
                 disabled:bg-neutral-50 disabled:text-neutral-500 transition-shadow"
      aria-required={required}
    />
  </div>
);

const TEXTAREA = ({ label, value, id, rows = 3, required }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-medium text-neutral-600 mb-1">
      {label}{required && <span className="text-danger-500 ml-0.5" aria-label="required">*</span>}
    </label>
    <textarea
      id={id}
      rows={rows}
      defaultValue={value}
      required={required}
      className="w-full px-2.5 py-2 text-sm rounded border border-neutral-200 bg-white
                 text-neutral-800 placeholder:text-neutral-400 resize-none
                 focus:outline-none focus:border-primary-400 focus:shadow-focus transition-shadow"
      aria-required={required}
    />
  </div>
);

/**
 * InputPanel — structured patient data input + AI generation trigger.
 * Left panel of the workspace split.
 */
export default function InputPanel({ doc, onGenerate, aiState }) {
  const { patient, visitDetails } = doc;
  const [openSection, setOpenSection] = useState('patient');

  const toggle = (id) => setOpenSection(prev => prev === id ? null : id);

  const isLoading = aiState === 'loading';

  return (
    <aside
      aria-label="Patient input panel"
      className="w-72 flex-shrink-0 flex flex-col bg-white border-r border-neutral-200 overflow-y-auto scrollbar-thin"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-200 flex-shrink-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Patient Input</p>
        <p className="text-xs text-neutral-400 mt-0.5">MRN {patient.mrn}</p>
      </div>

      <div className="flex-1 p-3 space-y-2">
        {/* AI disclaimer */}
        <Alert variant="info">
          <span className="font-medium">AI-Assisted.</span> Always verify generated content against source records.
        </Alert>

        {/* Patient Demographics */}
        <Accordion
          id="patient"
          label="Patient Demographics"
          icon={<User size={13} aria-hidden="true" />}
          open={openSection === 'patient'}
          onToggle={() => toggle('patient')}
        >
          <fieldset className="space-y-2">
            <legend className="sr-only">Patient demographic information</legend>
            <FIELD id="p-name"   label="Full Name"       value={patient.name}   required />
            <FIELD id="p-mrn"    label="MRN"             value={patient.mrn}              />
            <FIELD id="p-dob"    label="Date of Birth"   value={patient.dob}    type="date" required />
            <div className="grid grid-cols-2 gap-2">
              <FIELD id="p-age"    label="Age"           value={patient.age}    type="number" />
              <FIELD id="p-gender" label="Gender"        value={patient.gender}             />
            </div>
            <FIELD id="p-insurance" label="Insurance" value={patient.insurance} />
            <div>
              <label htmlFor="p-allergies" className="block text-xs font-medium text-neutral-600 mb-1">
                Allergies
              </label>
              <input
                id="p-allergies"
                type="text"
                defaultValue={patient.allergies.join(', ')}
                className="w-full h-8 px-2.5 text-sm rounded border border-neutral-200 bg-warning-50
                           border-warning-200 text-warning-800 focus:outline-none focus:border-warning-400
                           focus:shadow-[0_0_0_3px_rgba(245,158,11,0.25)] transition-shadow"
                aria-describedby="allergy-hint"
              />
              <p id="allergy-hint" className="text-xs text-warning-700 mt-0.5 flex items-center gap-1">
                <AlertCircle size={11} aria-hidden="true" />
                Verify allergy list before generation
              </p>
            </div>
          </fieldset>
        </Accordion>

        {/* Admission Details */}
        <Accordion
          id="admission"
          label="Admission / Visit"
          icon={<Calendar size={13} aria-hidden="true" />}
          open={openSection === 'admission'}
          onToggle={() => toggle('admission')}
        >
          <fieldset className="space-y-2">
            <legend className="sr-only">Admission and visit details</legend>
            <div className="grid grid-cols-2 gap-2">
              <FIELD id="adm-date" label="Admitted"    value={patient.admittedAt}    type="date" />
              <FIELD id="dis-date" label="Discharged"  value={patient.dischargedAt}  type="date" />
            </div>
            <FIELD id="v-ward"       label="Ward / Unit"         value={visitDetails.ward}                />
            <FIELD id="v-attending"  label="Attending Physician"  value={visitDetails.attendingPhysician}  />
            <FIELD id="v-adm-dx"     label="Admitting Diagnosis"  value={visitDetails.admittingDiagnosis}  required />
            <FIELD id="v-dis-dx"     label="Discharge Diagnosis"  value={visitDetails.dischargeDiagnosis}  required />
          </fieldset>
        </Accordion>

        {/* Clinical Notes */}
        <Accordion
          id="notes"
          label="Clinical Notes"
          icon={<Stethoscope size={13} aria-hidden="true" />}
          open={openSection === 'notes'}
          onToggle={() => toggle('notes')}
        >
          <fieldset className="space-y-2">
            <legend className="sr-only">Clinical notes and free-text input</legend>
            <TEXTAREA id="cn-subjective"  label="Subjective (patient narrative)"  rows={3} />
            <TEXTAREA id="cn-objective"   label="Objective (exam findings)"        rows={3} />
            <TEXTAREA id="cn-assessment"  label="Assessment & Plan"                rows={4} required />
          </fieldset>
        </Accordion>
      </div>

      {/* Generate action */}
      <div className="px-3 py-3 border-t border-neutral-200 flex-shrink-0 space-y-2">
        {aiState === 'error' && (
          <Alert variant="danger" title="Generation failed">
            Check connection and retry.
          </Alert>
        )}
        <Button
          variant="ai"
          size="md"
          loading={isLoading}
          onClick={onGenerate}
          className="w-full"
          aria-label={isLoading ? 'AI is generating document, please wait' : 'Generate document with AI'}
        >
          {isLoading ? 'Generating…' : '✦  Generate with AI'}
        </Button>
        <Button variant="secondary" size="sm" className="w-full">
          Save Draft
        </Button>
      </div>
    </aside>
  );
}

function Accordion({ id, label, icon, open, onToggle, children }) {
  return (
    <div className="border border-neutral-200 rounded overflow-hidden">
      <button
        type="button"
        id={`acc-header-${id}`}
        aria-expanded={open}
        aria-controls={`acc-panel-${id}`}
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-50 hover:bg-neutral-100
                   transition-colors text-left"
      >
        <span className="text-neutral-500">{icon}</span>
        <span className="flex-1 text-xs font-semibold text-neutral-700 uppercase tracking-wider">{label}</span>
        {open
          ? <ChevronUp size={13} className="text-neutral-400" aria-hidden="true" />
          : <ChevronDown size={13} className="text-neutral-400" aria-hidden="true" />
        }
      </button>
      <div
        id={`acc-panel-${id}`}
        role="region"
        aria-labelledby={`acc-header-${id}`}
        hidden={!open}
        className="p-3 space-y-2"
      >
        {children}
      </div>
    </div>
  );
}
